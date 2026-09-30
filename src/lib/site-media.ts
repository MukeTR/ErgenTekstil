import { cache } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import type { Locale } from "@/i18n/routing";

/**
 * Panelden değiştirilebilen sabit görsel yuvaları. Supabase'de (site_images) satır yoksa
 * `fallback` kullanılır; yani panelde hiçbir şey yapılmadıysa site bugünkü gibi görünür.
 */
export const SITE_IMAGE_SLOTS = [
  { key: "pageHero", page: "Genel", label: "Sayfa başlık bandı (Hakkımızda, Süreçler, Katalog, Blog, İletişim)", fallback: "/images/factory-floor.webp" },
  { key: "mobileNav.card", page: "Genel", label: "Mobil menüdeki teklif kartı", fallback: "/blog/Fuar-Blog.webp" },
  { key: "home.heroPoster", page: "Ana sayfa", label: "Slider arka plan videosu yüklenirken görünen görsel", fallback: "/images/factory-floor.webp" },
  { key: "home.color", page: "Ana sayfa", label: "Renk bölümü arka planı", fallback: "/marka/bg-sidea.webp" },
  { key: "home.growth", page: "Ana sayfa", label: "Büyüme / vizyon bölümü arka planı", fallback: "/images/factory-floor.webp" },
  { key: "about.intro", page: "Hakkımızda", label: "Giriş fotoğrafı", fallback: "/sureclerimiz/step-2-orme-teknolojisi.webp" },
  { key: "about.mission", page: "Hakkımızda", label: "Misyon kartı", fallback: "/blog/Fuar-Blog.webp" },
  { key: "about.vision", page: "Hakkımızda", label: "Vizyon kartı", fallback: "/images/factory-floor.webp" },
  { key: "process.step-1", page: "Süreçlerimiz", label: "1. adım", fallback: "/sureclerimiz/step-1-tasarim.webp" },
  { key: "process.step-2", page: "Süreçlerimiz", label: "2. adım", fallback: "/sureclerimiz/step-2-orme-teknolojisi.webp" },
  { key: "process.step-3", page: "Süreçlerimiz", label: "3. adım", fallback: "/sureclerimiz/step-3-malzeme.webp" },
  { key: "process.step-4", page: "Süreçlerimiz", label: "4. adım", fallback: "/sureclerimiz/step-4-dikissiz-orme.webp" },
  { key: "process.step-5", page: "Süreçlerimiz", label: "5. adım", fallback: "/sureclerimiz/step-5-kalite-kontrol.webp" },
  { key: "process.step-6", page: "Süreçlerimiz", label: "6. adım", fallback: "/sureclerimiz/step-6-boyama.webp" },
  { key: "process.step-7", page: "Süreçlerimiz", label: "7. adım", fallback: "/sureclerimiz/step-7-dikim.webp" },
  { key: "process.step-8", page: "Süreçlerimiz", label: "8. adım", fallback: "/sureclerimiz/step-8-ambalaj.webp" },
] as const;

export type SiteImageKey = (typeof SITE_IMAGE_SLOTS)[number]["key"];

const FALLBACKS = new Map<string, string>(SITE_IMAGE_SLOTS.map((s) => [s.key, s.fallback]));

/** İstek başına bir kez okunur; hata olursa varsayılan görsellerle devam edilir. */
export const getSiteImages = cache(async (): Promise<Record<SiteImageKey, string>> => {
  const { data, error } = await supabasePublic.from("site_images").select("key, url");
  if (error) console.error("site_images:", error.message);
  const overrides = new Map((data ?? []).map((r) => [r.key as string, r.url as string]));
  return Object.fromEntries(
    SITE_IMAGE_SLOTS.map((s) => [s.key, overrides.get(s.key) || FALLBACKS.get(s.key)!])
  ) as Record<SiteImageKey, string>;
});

export type LocalizedText = Partial<Record<Locale, string>>;

export type HeroSlideRow = {
  id: string;
  position: number;
  active: boolean;
  title: LocalizedText;
  subtitle: LocalizedText;
  images: string[];
};

/** Dil boşsa Türkçe metne düşer. */
export function localized(text: LocalizedText, locale: Locale): string {
  return text[locale]?.trim() || text.tr?.trim() || "";
}

export async function getActiveHeroSlides(): Promise<HeroSlideRow[]> {
  const { data, error } = await supabasePublic
    .from("hero_slides")
    .select("id, position, active, title, subtitle, images")
    .eq("active", true)
    .order("position");
  if (error) console.error("hero_slides:", error.message);
  return (data ?? []) as HeroSlideRow[];
}
