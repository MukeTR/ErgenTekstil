#!/usr/bin/env python3
"""Supabase'deki aktif ürünleri src/data/products.json'a ve görselleri public/urunler/sb/'ye alır.

Site artık Supabase'e bağlı değil; bu betik yalnızca kataloğu bir kez daha
taşımak gerekirse kullanılır. .env.local'de NEXT_PUBLIC_SUPABASE_URL ve
NEXT_PUBLIC_SUPABASE_ANON_KEY gerekir.
"""
import concurrent.futures as cf
import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
env = dict(
    line.split("=", 1)
    for line in (ROOT / ".env.local").read_text().splitlines()
    if "=" in line and not line.startswith("#")
)
url, key = env["NEXT_PUBLIC_SUPABASE_URL"], env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
req = urllib.request.Request(
    f"{url}/rest/v1/products?select=*&active=eq.true&order=sort_order.asc",
    headers={"apikey": key, "Authorization": f"Bearer {key}"},
)
rows = json.load(urllib.request.urlopen(req))
prefix = f"{url}/storage/v1/object/public/product-images/"

jobs = []
for p in rows:
    local = []
    for img in p["images"]:
        if img.startswith(prefix):
            rel = "sb/" + img[len(prefix):]
            jobs.append((img, ROOT / "public/urunler" / rel))
            local.append(rel)
        else:
            local.append(img)
    p["images"] = local


def fetch(job):
    src, dest = job
    dest.parent.mkdir(parents=True, exist_ok=True)
    for attempt in range(8):
        if dest.exists() and dest.stat().st_size:
            return
        try:
            dest.write_bytes(urllib.request.urlopen(src, timeout=30).read())
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            time.sleep(2 * (attempt + 1))


with cf.ThreadPoolExecutor(4) as ex:
    list(ex.map(fetch, jobs))

keep = ["id", "slug", "name", "category_keys", "color_keys", "features", "images", "sort_order"]
out = [{k: p[k] for k in keep} for p in rows]
(ROOT / "src/data/products.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
print(f"{len(out)} ürün, {len(jobs)} görsel")
