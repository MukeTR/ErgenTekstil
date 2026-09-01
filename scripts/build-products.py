import csv, json, re, unicodedata

SRC = "/Users/macos/Downloads/wc-product-export-31-8-2026-1788168910762.csv"
OUT = "/Users/macos/ErgenTekstil/src/data/products.json"

TR_MAP = str.maketrans({
    "ç":"c","Ç":"c","ğ":"g","Ğ":"g","ı":"i","İ":"i","ö":"o","Ö":"o",
    "ş":"s","Ş":"s","ü":"u","Ü":"u"
})

def slugify(name: str) -> str:
    s = name.translate(TR_MAP).lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s

def parse_features(html: str):
    if not html:
        return []
    items = re.findall(r"<li>(.*?)</li>", html, re.S)
    clean = []
    for it in items:
        it = re.sub(r"<[^>]+>", "", it).strip()
        it = it.replace("\\n", "").strip()
        if it:
            clean.append(it)
    return clean

def img_filename(url: str) -> str:
    return url.strip().split("/")[-1]

with open(SRC, encoding="utf-8-sig") as f:
    rows = list(csv.DictReader(f))

variations_by_parent = {}
for r in rows:
    if r["Tür"] == "variation" and r["Ebeveyn"].startswith("id:"):
        pid = r["Ebeveyn"].split(":", 1)[1]
        renk = ""
        if r["Nitelik 1 ismi"].strip().lower() in ("renk", "color"):
            renk = r["Nitelik 1 değer(ler)i"].strip()
        variations_by_parent.setdefault(pid, [])
        if renk:
            variations_by_parent[pid].append(renk)

groups = {}
for r in rows:
    if r["Tür"] not in ("simple", "variable"):
        continue
    name = re.sub(r"\s+", " ", r["İsim"].strip())
    slug = slugify(name)
    groups.setdefault(slug, []).append(r)

products = []
for slug, group_rows in groups.items():
    row = next((r for r in group_rows if r["Tür"] == "variable"), group_rows[0])
    name = re.sub(r"\s+", " ", row["İsim"].strip())

    colors = []
    if row["Tür"] == "variable":
        colors = variations_by_parent.get(row["Kimlik"], [])
    elif row["Nitelik 1 ismi"].strip().lower() in ("renk", "color") and row["Nitelik 1 değer(ler)i"].strip():
        colors = [c.strip() for c in row["Nitelik 1 değer(ler)i"].split(",") if c.strip()]

    images = []
    for r in group_rows:
        for u in r["Görseller"].split(","):
            fn = img_filename(u)
            if fn and fn not in images:
                images.append(fn)

    categories = [c.strip() for c in row["Kategoriler"].split(",") if c.strip()]

    products.append({
        "id": row["Kimlik"],
        "slug": slug,
        "name": name,
        "categoryKeys": categories,
        "categories": categories,
        "features": parse_features(row["Kısa açıklama"]) or parse_features(row["Açıklama"]),
        "colorKeys": colors,
        "colors": colors,
        "images": images,
    })

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"{len(products)} ürün yazıldı -> {OUT}")

all_images = set()
for p in products:
    all_images.update(p["images"])
with open("/Users/macos/ErgenTekstil/scripts/product-images.txt", "w") as f:
    f.write("\n".join(sorted(all_images)))
print(f"{len(all_images)} benzersiz ürün görseli listelendi")
