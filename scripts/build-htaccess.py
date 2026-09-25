#!/usr/bin/env python3
"""public/.htaccess üretir (Güzel Hosting / Apache, statik Next.js çıktısı).

- https + www kanonik yönlendirme
- "/" → tarayıcı diline göre /tr/, /en/, /ar/, /de/, /ru/
- Eski WordPress adreslerine (scripts/legacy-wp-urls.txt + src/data/blog-redirects.json) 301
- /_next/static için uzun önbellek, sıkıştırma, 404 sayfası

Çalıştır: python3 scripts/build-htaccess.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
products = json.loads((ROOT / "src/data/products.json").read_text())
blog_redirects = json.loads((ROOT / "src/data/blog-redirects.json").read_text())
legacy = [
    line.strip()
    for line in (ROOT / "scripts/legacy-wp-urls.txt").read_text().splitlines()
    if line.strip() and line.strip() != "/"
]

product_slugs = {p["slug"] for p in products}
by_code: dict[str, str] = {}
for p in products:
    m = re.search(r"(\d{3,4})$", p["slug"])
    if m:
        by_code.setdefault(m.group(1), p["slug"])

PAGES = {
    "hakkimizda": "/tr/hakkimizda/",
    "iletisim": "/tr/iletisim/",
    "sureclerimiz": "/tr/sureclerimiz/",
    "katalog": "/tr/katalog/",
    "online-katalog": "/tr/katalog/",
    "blog": "/tr/blog/",
    "gizlilik-politikasi": "/tr/gizlilik-politikasi/",
    "cerez-politikasi": "/tr/cerez-politikasi/",
    "kullanim-kosullari": "/tr/kullanim-kosullari/",
}

blog_map = {r["source"].strip("/"): r["destination"].rstrip("/") + "/" for r in blog_redirects}


def product_target(slug: str) -> str:
    if slug in product_slugs:
        return f"/tr/katalog/{slug}/"
    m = re.search(r"(\d{3,4})(?:-\d)?$", slug)
    if m and m.group(1) in by_code:
        return f"/tr/katalog/{by_code[m.group(1)]}/"
    return "/tr/katalog/"


redirects: dict[str, str] = {}
for src, dest in blog_map.items():
    redirects[src] = dest

for url in legacy:
    path = url.strip("/")
    if path in redirects:
        continue
    if path.startswith("urun/"):
        redirects[path] = product_target(path.split("/", 1)[1])
    elif path.startswith("urun-kategori/"):
        redirects[path] = "/tr/katalog/"
    elif path.startswith("category/"):
        redirects[path] = "/tr/blog/"
    elif path in PAGES:
        redirects[path] = PAGES[path]
    elif path in product_slugs or re.search(r"\d{3,4}(-\d)?$", path):
        redirects[path] = product_target(path)
    else:
        redirects[path] = "/tr/"

for path, dest in PAGES.items():
    redirects.setdefault(path, dest)

lines = [
    "# OTOMATİK ÜRETİLDİ — scripts/build-htaccess.py; elle düzenleme",
    "Options -Indexes -MultiViews",
    "DirectoryIndex index.html index.php",
    "ErrorDocument 404 /404.html",
    "",
    "<IfModule mod_rewrite.c>",
    "RewriteEngine On",
    "",
    "# Kanonik: https://www.ergentekstil.com (yalnız ana alan adında)",
    "RewriteCond %{HTTP_HOST} ^ergentekstil\\.com$ [NC]",
    "RewriteRule ^ https://www.ergentekstil.com%{REQUEST_URI} [L,R=301]",
    "RewriteCond %{HTTPS} off",
    "RewriteCond %{HTTP_HOST} ^www\\.ergentekstil\\.com$ [NC]",
    "RewriteRule ^ https://www.ergentekstil.com%{REQUEST_URI} [L,R=301]",
    "",
    "# Eski WordPress sistem adresleri",
    "RewriteRule ^(feed|comments/feed|wp-json|xmlrpc\\.php|wp-login\\.php|wp-admin)(/.*)?$ - [G,L]",
    "RewriteCond %{QUERY_STRING} (^|&)p=\\d+ [NC]",
    "RewriteRule ^$ /tr/? [L,R=301]",
    "",
    "# Kök → tarayıcı diline göre dil sürümü (varsayılan tr)",
    "RewriteCond %{HTTP:Accept-Language} ^en [NC]",
    "RewriteRule ^$ /en/ [L,R=302]",
    "RewriteCond %{HTTP:Accept-Language} ^ar [NC]",
    "RewriteRule ^$ /ar/ [L,R=302]",
    "RewriteCond %{HTTP:Accept-Language} ^de [NC]",
    "RewriteRule ^$ /de/ [L,R=302]",
    "RewriteCond %{HTTP:Accept-Language} ^ru [NC]",
    "RewriteRule ^$ /ru/ [L,R=302]",
    "RewriteRule ^$ /tr/ [L,R=302]",
    "",
    f"# Eski WordPress adresleri → yeni site ({len(redirects)} kural)",
]
for src in sorted(redirects):
    lines.append(f"RewriteRule ^{re.escape(src)}/?$ {redirects[src]} [L,R=301]")

lines += [
    "",
    "# Sonda eğik çizgi eksikse ekle (/tr/katalog → /tr/katalog/)",
    "RewriteCond %{REQUEST_FILENAME} !-f",
    "RewriteCond %{REQUEST_URI} !\\.[a-zA-Z0-9]+$",
    "RewriteCond %{REQUEST_URI} !/$",
    "RewriteRule ^(.*)$ /$1/ [L,R=301]",
    "</IfModule>",
    "",
    "<IfModule mod_deflate.c>",
    "AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml text/plain text/xml",
    "</IfModule>",
    "",
    "<IfModule mod_headers.c>",
    '<FilesMatch "\\.(js|css|woff2?)$">',
    'Header set Cache-Control "public, max-age=31536000, immutable"',
    "</FilesMatch>",
    '<FilesMatch "\\.(webp|jpe?g|png|svg|ico|mp4)$">',
    'Header set Cache-Control "public, max-age=2592000"',
    "</FilesMatch>",
    '<FilesMatch "\\.(html|txt)$">',
    'Header set Cache-Control "public, max-age=0, must-revalidate"',
    "</FilesMatch>",
    'Header always set X-Content-Type-Options "nosniff"',
    'Header always set Referrer-Policy "strict-origin-when-cross-origin"',
    "</IfModule>",
    "",
]

(ROOT / "public/.htaccess").write_text("\n".join(lines))
print(f"public/.htaccess yazıldı: {len(redirects)} yönlendirme")
