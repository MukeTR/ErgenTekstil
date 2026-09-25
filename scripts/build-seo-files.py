#!/usr/bin/env python3
"""robots.txt, sitemap.xml ve llms.txt üretir (statik çıktı için).

`npm run build` SONRASI çalıştırılır: sayfa listesini out/ klasöründen okur,
dosyaları hem public/'e (sonraki derlemeler için) hem out/'a yazar.
Metinler sitenin kendi içeriğinden (src/data/*.json) alınır; uydurma bilgi yok.

Çalıştır: python3 scripts/build-seo-files.py
"""
import json
from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "out"
SITE = "https://www.ergentekstil.com"
LOCALES = ["tr", "en", "ar", "de", "ru"]
TODAY = date.today().isoformat()

if not OUT.is_dir():
    raise SystemExit("Önce `npm run build` çalıştırın (out/ yok).")

products = json.loads((ROOT / "src/data/products.json").read_text())
content_en = json.loads((ROOT / "src/data/content.en.json").read_text())
blog_tr = json.loads((ROOT / "src/data/blog.tr.json").read_text())


def exists(locale: str, path: str) -> bool:
    return (OUT / locale / path / "index.html").is_file()


# Sayfa grupları: her grup tüm dillerde aynı içeriğin karşılıklarıdır (hreflang)
groups: list[tuple[str, list[str], str, str]] = []  # (path, diller, changefreq, priority)
for path, freq, prio in [
    ("", "weekly", "1.0"),
    ("katalog", "weekly", "0.9"),
    ("sureclerimiz", "monthly", "0.7"),
    ("hakkimizda", "monthly", "0.7"),
    ("iletisim", "yearly", "0.6"),
    ("blog", "weekly", "0.5"),
]:
    groups.append((path, [l for l in LOCALES if exists(l, path)], freq, prio))

for p in products:
    path = f"katalog/{p['slug']}"
    groups.append((path, [l for l in LOCALES if exists(l, path)], "monthly", "0.8"))

# Blog DE/RU'da İngilizce metin gösteriyor → yinelenen içerik olmasın diye yalnız tr/en/ar
for b in blog_tr:
    path = f"blog/{b['slug']}"
    groups.append((path, [l for l in ["tr", "en", "ar"] if exists(l, path)], "yearly", "0.4"))

# Yasal metinler yalnız Türkçe hukuki metin
for path in ["gizlilik-politikasi", "cerez-politikasi", "kullanim-kosullari"]:
    if exists("tr", path):
        groups.append((path, ["tr"], "yearly", "0.2"))


def url(locale: str, path: str) -> str:
    return f"{SITE}/{locale}/" + (f"{path}/" if path else "")


lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    # Tarayıcıda okunur tablo görünümü; xhtml:link yüzünden Chrome aksi halde düz metin gösterir
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
    'xmlns:xhtml="http://www.w3.org/1999/xhtml">',
]
count = 0
for path, locs, freq, prio in groups:
    for loc in locs:
        lines.append("  <url>")
        lines.append(f"    <loc>{escape(url(loc, path))}</loc>")
        lines.append(f"    <lastmod>{TODAY}</lastmod>")
        lines.append(f"    <changefreq>{freq}</changefreq>")
        lines.append(f"    <priority>{prio}</priority>")
        if len(locs) > 1:
            for alt in locs:
                lines.append(
                    f'    <xhtml:link rel="alternate" hreflang="{alt}" href="{escape(url(alt, path))}"/>'
                )
            lines.append(
                f'    <xhtml:link rel="alternate" hreflang="x-default" href="{escape(url(locs[0], path))}"/>'
            )
        lines.append("  </url>")
        count += 1
lines.append("</urlset>")
sitemap = "\n".join(lines) + "\n"

robots = f"""# Ergen Tekstil — tüm arama ve yapay zekâ tarayıcılarına açık
User-agent: *
Allow: /
Disallow: /api/

# Yapay zekâ arama/yanıt motorları (GEO): açıkça izinli
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: Bingbot
Allow: /
Disallow: /api/

Sitemap: {SITE}/sitemap.xml
"""

about, home, contact = content_en["about"], content_en["home"], content_en["contact"]
stats = {s["label"]: s["value"] for s in content_en["process"]["stats"]}
collections = "\n".join(f"- {c['title']}: {c['description']}" for c in home["collections"])
steps = "\n".join(f"{i}. {s['title']}" for i, s in enumerate(content_en["process"]["steps"], 1))


def pname(p: dict) -> str:
    return p["name"].get("en") or p["name"]["tr"]


product_lines = "\n".join(
    f"- [{pname(p)}]({url('en', 'katalog/' + p['slug'])})" for p in products
)

llms = f"""# Ergen Tekstil

> Ergen Tekstil is a Turkish manufacturer of seamless (dikişsiz) apparel founded in 2004: leggings, shapewear, shorts, activewear, underwear and thermal wear. It integrates knitting, dyeing, sewing and packaging, has a production capacity of {stats.get('Pieces Production Capacity', 200000):,} pieces per month, produces private-label for brands and exports to Europe, Africa and Asia. It is a B2B / wholesale manufacturer: products have no retail prices; buyers request a quote.

## Key facts

- Founded: 2004
- Business model: B2B manufacturer, private label (OEM) and wholesale; no retail sales
- Capacity: {stats.get('Pieces Production Capacity', 200000):,} pieces/month
- Markets: Europe, Africa and Asia (exports to three continents)
- Own brand: Formactive
- Head office: {contact['headOfficeAddress']}
- Branch office: {contact['branchAddress']}
- Email: {contact['email']}
- Phone: {', '.join(contact['phones'])}
- Website languages: Turkish (default), English, Arabic, German, Russian

## About

{about['missionText']}

{about['visionText']}

## Collections

{collections}

## Seamless production process

{steps}

Details: [Our processes]({url('en', 'sureclerimiz')})

## Main pages

- [Home]({url('en', '')}): overview of Ergen Tekstil
- [Catalogue]({url('en', 'katalog')}): all {len(products)} products with photos, colours, sizes and fabric composition
- [About us]({url('en', 'hakkimizda')})
- [Processes]({url('en', 'sureclerimiz')})
- [Contact / request a wholesale quote]({url('en', 'iletisim')})
- Turkish version: {url('tr', '')}

## Products

{product_lines}

## Optional

- [Blog]({url('en', 'blog')})
- [Sitemap]({SITE}/sitemap.xml)
"""

for target in (ROOT / "public", OUT):
    if target == OUT:
        (OUT / "sitemap.xsl").write_text((ROOT / "public/sitemap.xsl").read_text())
    (target / "sitemap.xml").write_text(sitemap)
    (target / "robots.txt").write_text(robots)
    (target / "llms.txt").write_text(llms)

print(f"sitemap.xml: {count} adres · robots.txt · llms.txt ({len(llms) // 1024} KB)")
