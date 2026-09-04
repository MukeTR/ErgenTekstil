import type { Locale } from "@/i18n/routing";
import { supabasePublic } from "@/lib/supabase/public";
import type { ProductRow } from "@/lib/supabase/types";
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

export async function getProducts(locale: Locale): Promise<Product[]> {
  const { data, error } = await supabasePublic
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getProducts failed:", error.message);
    return [];
  }

  return (data as ProductRow[]).map((row) => mapProduct(row, locale));
}

export async function getProduct(
  locale: Locale,
  slug: string
): Promise<Product | undefined> {
  const { data, error } = await supabasePublic
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return undefined;
  return mapProduct(data as ProductRow, locale);
}

export async function getCategoryKeys(): Promise<string[]> {
  const { data, error } = await supabasePublic
    .from("products")
    .select("category_keys")
    .eq("active", true);

  if (error || !data) return [];
  const all = (data as { category_keys: string[] }[]).flatMap(
    (r) => r.category_keys
  );
  return Array.from(new Set(all));
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
