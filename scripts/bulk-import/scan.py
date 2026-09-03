"""
Phase 1: scan both photo folders and produce a dry-run JSON report.
No uploads, no DB writes — just structure discovery for review.
"""
from __future__ import annotations

import json
import os
import re
import unicodedata
from pathlib import Path

FORMACTIVE_DIR = "/Users/macos/Desktop/ergen3/FORMACTİVE TÜM ÜRÜN FOTOĞRAFLARI"
SPOR_DIR = "/Users/macos/Desktop/ergen3/ERGEN GÖRSELLER SPOR"
BLOG_JSON = "/Users/macos/ErgenTekstil/src/data/blog.tr.json"
OUT = "/Users/macos/ErgenTekstil/scripts/bulk-import/scan-report.json"

IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}


def nfc(s):
    return unicodedata.normalize("NFC", s)


def tr_lower(s: str) -> str:
    # Python's default .casefold()/.lower() mishandles Turkish dotted İ:
    # "İ".casefold() -> "i̇" (i + combining dot above), which breaks
    # substring matches like "siyah" inside "Sİ YAH". Map the Turkish
    # letters explicitly before falling back to plain lower().
    s = nfc(s)
    s = s.replace("İ", "i").replace("I", "ı")
    return s.lower()


# Turkish colour word -> canonical taxonomy key (checked longest-first so
# "acı kahve" wins over "kahve", "bebe mavisi" over "mavi", etc.)
COLOR_WORDS = [
    ("bebe mavisi", "Bebe Mavisi"),
    ("bebemavi", "Bebe Mavisi"),
    ("bebe mavi", "Bebe Mavisi"),
    ("buz mavisi", "Buz Mavisi"),
    ("buz m.", "Buz Mavisi"),
    ("acı kahve", "Koyu Kahve"),
    ("mint yeşil", "Mint Yeşil"),
    ("mintyeşil", "Mint Yeşil"),
    ("k.yeşil", "Koyu Yeşil"),
    ("koyu yeşil", "Koyu Yeşil"),
    ("lacivert", "Lacivert"),
    ("laci", "Lacivert"),
    ("siyah", "Siyah"),
    ("beyaz", "Beyaz"),
    ("kırmızı", "Kırmızı"),
    ("pembe", "Pembe"),
    ("turuncu", "Turuncu"),
    ("kiremit", "Kremit"),
    ("kremit", "Kremit"),
    ("vişne", "Vişne"),
    ("i̇ndigo", "İndigo"),
    ("indigo", "İndigo"),
    ("kahve", "Kahve"),
    ("füme", "Füme"),
    ("antrasit", "Antrasit"),
    ("sarı", "Sarı"),
    ("haki", "Haki"),
    ("gri", "Gri"),
    ("camel", "Camel"),
    ("hardal", "Hardal"),
    ("lila", "Lila"),
    ("mavi", "Mavi"),
    ("yeşil", "Yeşil"),
    ("ten", "Ten"),
]
COLOR_WORDS = [(tr_lower(w), key) for w, key in COLOR_WORDS]


def detect_color(text: str):
    t = tr_lower(text)
    for word, key in COLOR_WORDS:
        if word in t:
            return key
    return None


def list_images(folder: str):
    out = []
    for root, _dirs, files in os.walk(folder):
        for f in files:
            if Path(f).suffix.lower() in IMG_EXT and not f.startswith("."):
                out.append(os.path.join(root, f))
    return sorted(out)


def load_blog_codes():
    data = json.load(open(BLOG_JSON, encoding="utf-8"))
    by_code = {}
    for post in data:
        code = post.get("code")
        if not code:
            continue
        by_code.setdefault(code, []).append(
            {"title": post["title"].strip(), "features": post.get("features", [])}
        )
    return by_code


def extract_code_from_folder(name: str):
    m = re.match(r"^(\d{3,4}(?:-\d{3,4})?)", name.strip())
    return m.group(1) if m else None


def scan_formactive():
    products = []
    for entry in sorted(os.listdir(FORMACTIVE_DIR)):
        full = os.path.join(FORMACTIVE_DIR, entry)
        if not os.path.isdir(full):
            continue

        if entry == "AGRAFLI KORSE":
            # this one is a category folder containing further code folders
            for sub in sorted(os.listdir(full)):
                subfull = os.path.join(full, sub)
                if os.path.isdir(subfull):
                    products.append(scan_leaf_folder(subfull, sub, parent_label="AGRAFLI KORSE"))
            continue

        products.append(scan_leaf_folder(full, entry))
    return products


def scan_leaf_folder(full: str, entry: str, parent_label: str | None = None):
    code = extract_code_from_folder(entry)
    is_takim = bool(code and "-" in code)

    # descriptive suffix after the code, e.g. "1525 - Fitilli Biker Şort" -> "Fitilli Biker Şort"
    desc = entry
    if code:
        desc = entry[len(code):].strip(" -")
    if not desc and parent_label:
        desc = parent_label

    subdirs = [d for d in os.listdir(full) if os.path.isdir(os.path.join(full, d))]
    color_map = {}
    loose_images = []

    if subdirs and all(detect_color(d) for d in subdirs):
        # colour-per-subfolder structure
        for d in subdirs:
            color_key = detect_color(d)
            imgs = list_images(os.path.join(full, d))
            color_map.setdefault(color_key, []).extend(imgs)
        # any loose files directly in the parent too
        loose_images = [
            os.path.join(full, f)
            for f in os.listdir(full)
            if os.path.isfile(os.path.join(full, f)) and Path(f).suffix.lower() in IMG_EXT
        ]
    else:
        all_imgs = list_images(full)
        # try per-filename colour detection (used by the SPOR folder style)
        for img in all_imgs:
            color_key = detect_color(os.path.basename(img))
            if color_key:
                color_map.setdefault(color_key, []).append(img)
            else:
                loose_images.append(img)

    total_images = sum(len(v) for v in color_map.values()) + len(loose_images)

    return {
        "code": code,
        "folder": entry,
        "full_path": full,
        "is_takim": is_takim,
        "descriptive_name": desc if desc != entry else None,
        "colors": {k: len(v) for k, v in color_map.items()},
        "loose_image_count": len(loose_images),
        "total_images": total_images,
        "_color_map": color_map,
        "_loose_images": loose_images,
    }


def scan_spor():
    products = []
    for entry in sorted(os.listdir(SPOR_DIR)):
        full = os.path.join(SPOR_DIR, entry)
        if not os.path.isdir(full):
            continue
        products.append(scan_leaf_folder(full, entry))

    loose_root_images = [
        os.path.join(SPOR_DIR, f)
        for f in os.listdir(SPOR_DIR)
        if os.path.isfile(os.path.join(SPOR_DIR, f)) and Path(f).suffix.lower() in IMG_EXT
    ]
    return products, loose_root_images


def main():
    blog_codes = load_blog_codes()
    formactive = scan_formactive()
    spor, spor_loose = scan_spor()

    def strip_internal(p):
        return {k: v for k, v in p.items() if not k.startswith("_")}

    report = {
        "formactive": {
            "count": len(formactive),
            "products": [strip_internal(p) for p in formactive],
        },
        "spor": {
            "count": len(spor),
            "products": [strip_internal(p) for p in spor],
            "root_loose_images": len(spor_loose),
            "root_loose_filenames": [os.path.basename(f) for f in spor_loose],
        },
        "blog_codes_available": sorted(blog_codes.keys(), key=lambda x: (len(x), x)),
    }

    # cross-check: which formactive codes have blog data vs not
    matched, unmatched = [], []
    for p in formactive:
        code = p["code"]
        if not code:
            unmatched.append(p["folder"])
        elif code in blog_codes:
            matched.append(code)
        else:
            unmatched.append(f"{code} ({p['folder']})")
    report["formactive_code_match_summary"] = {
        "matched_with_blog_data": len(matched),
        "unmatched_no_blog_data": unmatched,
    }

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"FORMACTIVE: {len(formactive)} klasör taranadı")
    print(f"SPOR: {len(spor)} klasör tarandı, {len(spor_loose)} kök seviye gevşek dosya")
    print(f"Blog eşleşmesi: {len(matched)} eşleşti, {len(unmatched)} eşleşmedi")
    print(f"Rapor yazıldı -> {OUT}")


if __name__ == "__main__":
    main()
