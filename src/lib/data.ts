import type { Locale } from "@/i18n/routing";
import productRows from "@/data/products.json";
import { categoryLabel, colorLabel } from "@/lib/catalog-taxonomy";

import blogTr from "@/data/blog.tr.json";
import blogEn from "@/data/blog.en.json";
import blogAr from "@/data/blog.ar.json";

import contentTr from "@/data/content.tr.json";
import contentEn from "@/data/content.en.json";
import contentAr from "@/data/content.ar.json";
import contentDe from "@/data/content.de.json";
import contentRu from "@/data/content.ru.json";

export type Product = {
  id: string;
  slug: string;
  name: string;
  categoryKeys: string[];
  categories: string[];
  features: string[];
  colorKeys: string[];
  colors: string[];
  images: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  image: string | null;
  content?: { tag: string; text: string }[];
  code?: string | null;
  features?: string[];
};

// Blog yazıları henüz DE/RU'ya çevrilmedi; EN içerik gösterilir.
const blogPosts: Record<Locale, BlogPost[]> = {
  tr: blogTr as BlogPost[],
  en: blogEn as BlogPost[],
  ar: blogAr as BlogPost[],
  de: blogEn as BlogPost[],
  ru: blogEn as BlogPost[],
};

export type SiteContent = typeof contentTr;

const content: Record<Locale, SiteContent> = {
  tr: contentTr,
  en: contentEn as SiteContent,
  ar: contentAr as SiteContent,
  de: contentDe as SiteContent,
  ru: contentRu as SiteContent,
};

type LocalizedText = { tr: string; en: string; ar: string; de?: string; ru?: string };
type LocalizedList = { tr: string[]; en: string[]; ar: string[]; de?: string[]; ru?: string[] };

type ProductRow = {
  id: string;
  slug: string;
  name: LocalizedText;
  category_keys: string[];
  color_keys: string[];
  features: LocalizedList;
  images: string[];
  sort_order: number;
};

function mapProduct(row: ProductRow, locale: Locale): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name[locale] || row.name.en || row.name.tr,
    categoryKeys: row.category_keys,
    categories: row.category_keys.map((k) => categoryLabel(locale, k)),
    features: row.features[locale]?.length
      ? row.features[locale]
      : row.features.en?.length
        ? row.features.en
        : row.features.tr,
    colorKeys: row.color_keys,
    colors: row.color_keys.map((k) => colorLabel(locale, k)),
    images: row.images,
  };
}

// Katalog, Supabase'den alınmış statik anlık görüntüdür (src/data/products.json).
// Güncellemek için: scripts/snapshot-products.py

/** Ürün kodu, ilk görselin klasöründen okunur: "sb/1510/0-Y1.png.webp" → "1510" */
function productCode(row: ProductRow): string {
  return row.images[0]?.match(/^sb\/([^/]+)\//)?.[1] ?? "";
}

// Vitrin sırası: site spor giyimi öne çıkarır. Önce elle seçilmiş manken çekimli
// spor ürünleri, sonra diğer tayt/şort/spor büstiyerler, sonra FORMactive spor
// takımları, en sonda korse ve iç giyim. Grup içinde paneldeki sıra korunur.
const FEATURED_SPORT_CODES = [
  "1510", "1550", "1700", "1725", "1430", "1610-1625", "1625", "1525",
];
const SPORT_CODES = new Set(["1610", "1710", "2000", "2020", "2135", "1435"]);
const SPORT_SET_CODES = new Set(["6100-6200", "8100-8200", "8350"]);

function sportRank(row: ProductRow): number {
  const code = productCode(row);
  const featured = FEATURED_SPORT_CODES.indexOf(code);
  if (featured !== -1) return featured;
  if (SPORT_CODES.has(code)) return 100;
  if (row.category_keys.some((k) => k === "Tayt" || k === "Şort")) return 100;
  if (/^1[89]\d\d/.test(code) || SPORT_SET_CODES.has(code)) return 200;
  return 300;
}

const rows = (productRows as ProductRow[])
  .slice()
  .sort((a, b) => sportRank(a) - sportRank(b) || a.sort_order - b.sort_order);

/** Ana sayfa vitrini: manken çekimli spor ürünleri */
export async function getFeaturedProducts(locale: Locale): Promise<Product[]> {
  return rows
    .filter((r) => FEATURED_SPORT_CODES.includes(productCode(r)))
    .map((row) => mapProduct(row, locale));
}

export async function getProducts(locale: Locale): Promise<Product[]> {
  return rows.map((row) => mapProduct(row, locale));
}

export async function getProduct(
  locale: Locale,
  slug: string
): Promise<Product | undefined> {
  const row = rows.find((r) => r.slug === slug);
  return row ? mapProduct(row, locale) : undefined;
}

export function getProductSlugs(): string[] {
  return rows.map((r) => r.slug);
}

export async function getCategoryKeys(): Promise<string[]> {
  const present = new Set(rows.flatMap((r) => r.category_keys));
  // Süzgeç sırası da spor önce
  const order = ["Tayt", "Şort", "Genel", "Korse"];
  return [
    ...order.filter((k) => present.has(k)),
    ...Array.from(present).filter((k) => !order.includes(k)),
  ];
}

export function getBlogPosts(locale: Locale): BlogPost[] {
  return blogPosts[locale];
}

export function getBlogPost(locale: Locale, slug: string): BlogPost | undefined {
  return blogPosts[locale].find((p) => p.slug === slug);
}

export function getContent(locale: Locale): SiteContent {
  return content[locale];
}

export function productImageUrl(filename: string) {
  return filename.startsWith("http") ? filename : `/urunler/${filename}`;
}

export function blogImageUrl(filename: string) {
  return `/blog/${filename}`;
}
