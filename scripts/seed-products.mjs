// One-time migration: load the static per-locale product JSON files into
// the `products` table so the admin panel becomes the source of truth.
// Run with: node --env-file=.env.local scripts/seed-products.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function loadJson(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url)));
}

const tr = loadJson("../src/data/products.tr.json");
const en = loadJson("../src/data/products.en.json");
const ar = loadJson("../src/data/products.ar.json");

const bySlug = new Map();
for (const p of tr) bySlug.set(p.slug, { tr: p });
for (const p of en) bySlug.get(p.slug).en = p;
for (const p of ar) bySlug.get(p.slug).ar = p;

const rows = [...bySlug.entries()].map(([slug, { tr, en, ar }], index) => ({
  slug,
  legacy_id: tr.id,
  name: { tr: tr.name, en: en.name, ar: ar.name },
  category_keys: tr.categoryKeys,
  color_keys: tr.colorKeys,
  features: { tr: tr.features, en: en.features, ar: ar.features },
  images: tr.images,
  active: true,
  sort_order: index,
}));

const { data, error } = await supabase
  .from("products")
  .upsert(rows, { onConflict: "slug" })
  .select("slug");

if (error) {
  console.error("Seed failed:", error);
  process.exit(1);
}

console.log(`Seeded ${data.length} products.`);
