import json, re

RAW = "/Users/macos/ErgenTekstil/scripts/blog-raw.json"
EXISTING_TR = "/Users/macos/ErgenTekstil/src/data/blog.tr.json"
PRODUCTS_TR = "/Users/macos/ErgenTekstil/src/data/products.tr.json"
TRANSLATE_SCRIPT = "/Users/macos/ErgenTekstil/scripts/translate-products.py"

EDITORIAL_SLUGS = {
    "uretimde-mukemmellik-ergen-tekstilin-kalite-standartlari",
    "surdurulebilir-modaya-adim-adim-ergen-tekstilin-cevre-dostu-yaklasimi",
    "dikissiz-teknolojinin-gucu-formactive-ile-tanisin",
    "ergen-tekstilin-yenilikci-urun-tasarimlari",
    "ergen-tekstilden-fuar-haberleri-istanbulda-moda-bulusmasi",
    "markalarimiz",
}

ns = {}
code = open(TRANSLATE_SCRIPT).read().split("with open(SRC")[0]
exec(code, ns)
FEATURE_EN, FEATURE_AR = ns["FEATURE_EN"], ns["FEATURE_AR"]

raw = json.load(open(RAW, encoding="utf-8"))
existing_tr = json.load(open(EXISTING_TR, encoding="utf-8"))
existing_by_slug = {p["slug"]: p for p in existing_tr}
products = {p["slug"]: p for p in json.load(open(PRODUCTS_TR, encoding="utf-8"))}

CODE_RE = re.compile(r"^Code\s*(\d+)$", re.I)


def parse_entry(raw_entry):
    slug = raw_entry["slug"]
    title = raw_entry["title"]
    code = None
    features = []
    for block in raw_entry["content"]:
        if block["tag"] == "p":
            m = CODE_RE.match(block["text"].strip())
            if m:
                code = m.group(1)
                continue
        if block["tag"] == "li":
            features.append(block["text"].strip())

    image = raw_entry["images"][0] if raw_entry["images"] else None
    if not image and slug in products and products[slug]["images"]:
        image = products[slug]["images"][0]

    return {
        "slug": slug,
        "title": title,
        "code": code,
        "image": image,
        "features": features,
    }


tr_out = []
for raw_entry in raw:
    slug = raw_entry["slug"]
    if slug in EDITORIAL_SLUGS:
        tr_out.append(existing_by_slug[slug])
    elif slug == "online-katalog":
        tr_out.append({
            "slug": slug,
            "title": raw_entry["title"],
            "image": raw_entry["images"][0] if raw_entry["images"] else None,
            "content": [
                {"tag": "p", "text": "Ürün kataloğumuzu incelemek için bizimle iletişime geçin."}
            ],
        })
    else:
        tr_out.append(parse_entry(raw_entry))

with open(EXISTING_TR, "w", encoding="utf-8") as f:
    json.dump(tr_out, f, ensure_ascii=False, indent=2)

print(f"{len(tr_out)} blog yazısı yazıldı -> {EXISTING_TR}")
no_image = [p["slug"] for p in tr_out if not p.get("image")]
print(f"Görselsiz: {len(no_image)}")


def translate_entry(entry, feat_map):
    if "features" not in entry:
        return dict(entry)  # editorial / online-katalog: TR content carried, translated separately
    return {
        **entry,
        "features": [feat_map.get(f, f) for f in entry["features"]],
    }


for lang, feat_map, src_file in [
    ("en", FEATURE_EN, "/Users/macos/ErgenTekstil/src/data/blog.en.json"),
    ("ar", FEATURE_AR, "/Users/macos/ErgenTekstil/src/data/blog.ar.json"),
]:
    existing_lang = json.load(open(src_file, encoding="utf-8"))
    existing_lang_by_slug = {p["slug"]: p for p in existing_lang}
    out = []
    for entry in tr_out:
        slug = entry["slug"]
        if slug in EDITORIAL_SLUGS or slug == "online-katalog":
            out.append(existing_lang_by_slug.get(slug, entry))
        else:
            out.append(translate_entry(entry, feat_map))
    with open(src_file, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"{len(out)} -> {src_file}")

# Redirect map for old flat URLs -> new locale-prefixed blog URLs (single-hop 301s)
redirects = [{"source": f"/{p['slug']}", "destination": f"/tr/blog/{p['slug']}", "permanent": True} for p in tr_out]
with open("/Users/macos/ErgenTekstil/src/data/blog-redirects.json", "w", encoding="utf-8") as f:
    json.dump(redirects, f, ensure_ascii=False, indent=2)
print(f"{len(redirects)} redirect kuralı -> scripts/blog-redirects.json")
