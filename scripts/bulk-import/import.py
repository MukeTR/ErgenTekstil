"""
Phase 2: actually process images and upsert products into Supabase.

Usage:
  python3 import.py --dry-run          # plan only, no uploads/writes
  python3 import.py --limit 3          # process only first N leaf folders (smoke test)
  python3 import.py                    # full run

Requires env vars from ../../.env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
"""
from __future__ import annotations

import argparse
import io
import json
import os
import re
import sys
import unicodedata

import requests
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from scan import (  # noqa: E402
    scan_formactive,
    scan_spor,
    load_blog_codes,
    tr_lower,
)

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_FILE = os.path.join(ROOT, ".env.local")


def load_env():
    env = {}
    for line in open(ENV_FILE, encoding="utf-8"):
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k] = v
    return env


ENV = load_env()
SUPABASE_URL = ENV["NEXT_PUBLIC_SUPABASE_URL"]
SERVICE_KEY = ENV["SUPABASE_SERVICE_ROLE_KEY"]
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}

TR_MAP = str.maketrans({
    "ç": "c", "Ç": "c", "ğ": "g", "Ğ": "g", "ı": "i", "İ": "i", "ö": "o", "Ö": "o",
    "ş": "s", "Ş": "s", "ü": "u", "Ü": "u",
})


def slugify(name: str) -> str:
    s = name.translate(TR_MAP).lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return re.sub(r"-+", "-", s).strip("-")


CATEGORY_RULES = [
    ("korse", "Korse"),
    ("büstiyer", "Korse"),
    ("bustiyer", "Korse"),
    ("body", "Korse"),
    ("slip", "Korse"),
    ("boxer", "Korse"),
    ("atlet", "Korse"),
    ("tayt", "Tayt"),
    ("kapri", "Tayt"),
    ("şort", "Şort"),
    ("sort", "Şort"),
]


def smart_title(s: str) -> str:
    # Python's str.title() mangles Turkish text ("Büzgülü" -> "BüZgüLü").
    # Only apply real title-casing to genuinely ALL-CAPS source strings
    # (like "AGRAFLI KORSE"); folder names that are already mixed-case
    # (like "Toparlayıcı Biker Şort") are left untouched.
    if not s.isupper():
        return s
    words = s.split(" ")
    out = []
    for w in words:
        if not w:
            continue
        lowered = tr_lower(w)  # turkish-correct: I -> ı, İ -> i, rest plain lower()
        # capitalize just the first char, with the one Turkish exception
        # .upper() gets wrong (dotted lowercase i -> should be İ, not I)
        first = "İ" if lowered[0] == "i" else lowered[0].upper()
        out.append(first + lowered[1:])
    return " ".join(out)


def infer_category(name: str):
    t = tr_lower(name)
    for word, cat in CATEGORY_RULES:
        if word in t:
            return [cat]
    return ["Genel"]


def fetch_existing_products():
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/products",
        headers=HEADERS,
        params={"select": "id,slug,legacy_id,name,category_keys,color_keys,images,sort_order"},
    )
    r.raise_for_status()
    rows = r.json()
    by_code = {}
    max_sort = 0
    all_slugs = set()
    for row in rows:
        all_slugs.add(row["slug"])
        max_sort = max(max_sort, row.get("sort_order") or 0)
        m = re.search(r"(\d{3,4})\s*$", row["name"]["tr"].strip())
        if m:
            by_code[m.group(1)] = row
    return by_code, max_sort, all_slugs


def process_image(path: str, max_width=1400, quality=80) -> bytes:
    img = Image.open(path)
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")
    if img.width > max_width:
        h = int(img.height * (max_width / img.width))
        img = img.resize((max_width, h), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="WEBP", quality=quality, method=4)
    return buf.getvalue()


def upload_image(local_path: str, storage_path: str) -> str:
    data = process_image(local_path)
    url = f"{SUPABASE_URL}/storage/v1/object/product-images/{storage_path}"
    r = requests.post(
        url,
        headers={
            "apikey": SERVICE_KEY,
            "Authorization": f"Bearer {SERVICE_KEY}",
            "Content-Type": "image/webp",
            "x-upsert": "true",
        },
        data=data,
    )
    if r.status_code not in (200, 201):
        raise RuntimeError(f"upload failed {r.status_code}: {r.text[:200]}")
    return f"{SUPABASE_URL}/storage/v1/object/public/product-images/{storage_path}"


def collect_all_images(product: dict) -> list[str]:
    paths = []
    for color, imgs in product["_color_map"].items():
        paths.extend(imgs)
    paths.extend(product["_loose_images"])
    return paths


def unique_slug(base: str, taken: set) -> str:
    slug = base
    i = 2
    while slug in taken:
        slug = f"{base}-{i}"
        i += 1
    taken.add(slug)
    return slug


def build_takim_name(code: str, blog_codes: dict, all_leaves_by_code: dict) -> str:
    parts = code.split("-")
    names = []
    for p in parts:
        if p in blog_codes:
            names.append(blog_codes[p][0]["title"])
        elif p in all_leaves_by_code and all_leaves_by_code[p].get("descriptive_name"):
            names.append(all_leaves_by_code[p]["descriptive_name"])
    if len(names) == len(parts) and names:
        return " + ".join(names) + " Takım"
    return f"Takım {code}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--only", type=str, default=None, help="only process this one code")
    args = ap.parse_args()

    blog_codes = load_blog_codes()
    formactive = scan_formactive()
    spor, _spor_loose = scan_spor()

    formactive_by_code = {p["code"]: p for p in formactive if p["code"]}
    existing_by_code, max_sort, all_slugs = fetch_existing_products()
    sort_counter = max_sort + 1

    updates = []
    inserts = []
    skipped = []

    def make_entry(p, source_label):
        code = p["code"]
        imgs = collect_all_images(p)
        if not imgs:
            skipped.append(f"{source_label} {code} ({p['folder']}) - 0 görsel")
            return None

        colors = sorted(p["colors"].keys())

        if not p["is_takim"] and code in existing_by_code:
            existing = existing_by_code[code]
            merged_colors = sorted(set(existing.get("color_keys") or []) | set(colors))
            return {
                "mode": "update",
                "id": existing["id"],
                "code": code,
                "name": existing["name"]["tr"],
                "images_local": imgs,
                "color_keys": merged_colors,
            }

        # new product
        if p["is_takim"]:
            name = build_takim_name(code, blog_codes, formactive_by_code)
        elif code in blog_codes:
            name = blog_codes[code][0]["title"].strip()
        elif p.get("descriptive_name"):
            name = smart_title(p["descriptive_name"].strip())
        else:
            name = f"Ürün {code}"

        features = blog_codes[code][0]["features"] if (not p["is_takim"] and code in blog_codes) else []
        category = infer_category(name) if not source_label == "SPOR" else ["Genel"]
        slug = unique_slug(slugify(name) or f"urun-{code}", all_slugs)

        return {
            "mode": "insert",
            "code": code,
            "name": name,
            "features": features,
            "category_keys": category,
            "color_keys": colors,
            "images_local": imgs,
            "slug": slug,
        }

    all_entries = []
    for p in formactive:
        if p["code"] is None:
            skipped.append(f"FORMACTIVE isimsiz/kodsuz: {p['folder']}")
            continue
        e = make_entry(p, "FORMACTIVE")
        if e:
            all_entries.append(e)

    for p in spor:
        e = make_entry(p, "SPOR")
        if e:
            all_entries.append(e)

    if args.only:
        all_entries = [e for e in all_entries if e["code"] == args.only]
    if args.limit:
        all_entries = all_entries[: args.limit]

    print(f"Toplam işlenecek: {len(all_entries)} ({sum(1 for e in all_entries if e['mode']=='insert')} yeni, "
          f"{sum(1 for e in all_entries if e['mode']=='update')} güncelleme)")
    print(f"Atlanan (0 görsel): {len(skipped)}")
    for s in skipped:
        print("  -", s)

    if args.dry_run:
        for e in all_entries:
            print(f"[{e['mode']}] {e['code']} -> {e['name']} | {len(e['images_local'])} görsel | renk: {e.get('color_keys')}")
        return

    for i, e in enumerate(all_entries):
        print(f"({i+1}/{len(all_entries)}) {e['mode']} {e['code']} - {e['name']} - {len(e['images_local'])} görsel yükleniyor...")
        uploaded = []
        for j, local_path in enumerate(e["images_local"]):
            storage_path = f"{e['code'].replace('/', '-')}/{j}-{os.path.basename(local_path)}.webp"
            storage_path = re.sub(r"[^a-zA-Z0-9._/-]", "_", storage_path)
            try:
                url = upload_image(local_path, storage_path)
                uploaded.append(url)
            except Exception as ex:
                print(f"    HATA (görsel atlandı): {ex}")

        if not uploaded:
            print("    Hiç görsel yüklenemedi, atlanıyor")
            continue

        if e["mode"] == "update":
            payload = {"images": uploaded, "color_keys": e["color_keys"]}
            r = requests.patch(
                f"{SUPABASE_URL}/rest/v1/products",
                headers=HEADERS,
                params={"id": f"eq.{e['id']}"},
                data=json.dumps(payload),
            )
        else:
            nonlocal_sort = sort_counter
            sort_counter += 1
            payload = {
                "slug": e["slug"],
                "legacy_id": e["code"],
                "name": {"tr": e["name"], "en": "", "ar": ""},
                "category_keys": e["category_keys"],
                "color_keys": e["color_keys"],
                "features": {"tr": e["features"], "en": [], "ar": []},
                "images": uploaded,
                "active": True,
                "sort_order": nonlocal_sort,
            }
            r = requests.post(
                f"{SUPABASE_URL}/rest/v1/products",
                headers=HEADERS,
                data=json.dumps(payload),
            )

        if r.status_code not in (200, 201, 204):
            print(f"    DB HATASI {r.status_code}: {r.text[:300]}")
        else:
            print("    tamam")

    print("Bitti.")


if __name__ == "__main__":
    main()
