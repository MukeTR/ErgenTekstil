import type { Locale } from "@/i18n/routing";

import productsTr from "@/data/products.tr.json";
import productsEn from "@/data/products.en.json";
import productsAr from "@/data/products.ar.json";

import blogTr from "@/data/blog.tr.json";
import blogEn from "@/data/blog.en.json";
import blogAr from "@/data/blog.ar.json";

import contentTr from "@/data/content.tr.json";
import contentEn from "@/data/content.en.json";
import contentAr from "@/data/content.ar.json";

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

const products: Record<Locale, Product[]> = {
  tr: productsTr as Product[],
  en: productsEn as Product[],
  ar: productsAr as Product[],
};

const blogPosts: Record<Locale, BlogPost[]> = {
  tr: blogTr as BlogPost[],
  en: blogEn as BlogPost[],
  ar: blogAr as BlogPost[],
};

export type SiteContent = typeof contentTr;

const content: Record<Locale, SiteContent> = {
  tr: contentTr,
  en: contentEn as SiteContent,
  ar: contentAr as SiteContent,
};

export function getProducts(locale: Locale): Product[] {
  return products[locale];
}

export function getProduct(locale: Locale, slug: string): Product | undefined {
  return products[locale].find((p) => p.slug === slug);
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

// TR category keys are the canonical, locale-stable values used for filtering.
const CATEGORY_KEYS_TR = productsTr.flatMap((p) => p.categoryKeys);
export const categoryKeys = Array.from(new Set(CATEGORY_KEYS_TR));

export function productImageUrl(filename: string) {
  return `/urunler/${filename}`;
}

export function blogImageUrl(filename: string) {
  return `/blog/${filename}`;
}
