import { cache } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import type { Locale } from "@/i18n/routing";

const PRODUCT_IMAGES =
  "https://mxjyyywiooxikcwfylys.supabase.co/storage/v1/object/public/product-images";

/**
 * Panelden değiştirilebilen sabit görsel yuvaları. Supabase'de (site_images) satır yoksa
 * `fallback` kullanılır; yani panelde hiçbir şey yapılmadıysa site bugünkü gibi görünür.
 */
export const SITE_IMAGE_SLOTS = [
  { key: "pageHero", page: "Genel", label: "Sayfa başlık bandı (Hakkımızda, Süreçler, Katalog, Blog, İletişim)", fallback: "/tesis/orme-koridor.webp" },
  { key: "mobileNav.card", page: "Genel", label: "Mobil menüdeki iletişim kartı", fallback: "/tesis/dis-cephe.webp" },
  { key: "home.heroPoster", page: "Ana sayfa", label: "Slider arka plan videosu yüklenirken görünen görsel", fallback: "/tesis/hero-poster.webp" },
  { key: "home.color", page: "Ana sayfa", label: "Renk bölümü arka planı", fallback: "/marka/bg-sidea.webp" },
  { key: "home.growth", page: "Ana sayfa", label: "Büyüme / vizyon bölümü arka planı", fallback: "/tesis/dis-cephe-genis.webp" },
  { key: "home.collection.shorts", page: "Ana sayfa", label: "Koleksiyon kutusu: Aktif Giyim", fallback: `${PRODUCT_IMAGES}/1510/0-Y1.png.webp` },
  { key: "home.collection.tank", page: "Ana sayfa", label: "Koleksiyon kutusu: Kadın Aktif Spor Giyim", fallback: `${PRODUCT_IMAGES}/1550/0-ATOS6988.jpg.webp` },
  { key: "home.collection.leggings", page: "Ana sayfa", label: "Koleksiyon kutusu: Fonksiyonel Tekstiller", fallback: `${PRODUCT_IMAGES}/1700/0-ATOS0799.jpg.webp` },
  { key: "home.collection.bra", page: "Ana sayfa", label: "Koleksiyon kutusu: İç Giyim", fallback: `${PRODUCT_IMAGES}/2020/0-FAC_2900.jpg.webp` },
  { key: "home.collection.corset", page: "Ana sayfa", label: "Koleksiyon kutusu: Korse", fallback: `${PRODUCT_IMAGES}/1060/0-FAC_2166.jpg.webp` },
  { key: "home.facility", page: "Ana sayfa", label: "Tesisimiz bölümü büyük görseli", fallback: "/tesis/dis-cephe.webp" },
  { key: "facility.hero", page: "Tesisimiz", label: "Sayfa başı videosu yüklenirken görünen görsel", fallback: "/tesis/hero-poster.webp" },
  { key: "facility.intro", page: "Tesisimiz", label: "Giriş fotoğrafı (fabrika dış cephe)", fallback: "/tesis/dis-cephe.webp" },
  { key: "facility.film", page: "Tesisimiz", label: "Fabrika filmi kapak görseli", fallback: "/tesis/orme-bant.webp" },
  { key: "facility.dept-1", page: "Tesisimiz", label: "Bölüm 1: Ar-Ge ve Tasarım", fallback: "/tesis/arge.webp" },
  { key: "facility.dept-2", page: "Tesisimiz", label: "Bölüm 2: Dikişsiz Örme", fallback: "/tesis/orme-salonu.webp" },
  { key: "facility.dept-3", page: "Tesisimiz", label: "Bölüm 3: Kumaş Kontrolü", fallback: "/tesis/kumas-kontrol.webp" },
  { key: "facility.dept-4", page: "Tesisimiz", label: "Bölüm 4: Kesim ve Kalıp", fallback: "/tesis/kesim.webp" },
  { key: "facility.dept-5", page: "Tesisimiz", label: "Bölüm 5: Dikim", fallback: "/tesis/dikim.webp" },
  { key: "facility.dept-6", page: "Tesisimiz", label: "Bölüm 6: Kalite Kontrol", fallback: "/tesis/kalite-kontrol.webp" },
  { key: "facility.dept-7", page: "Tesisimiz", label: "Bölüm 7: Ütü ve Paketleme", fallback: "/tesis/paketleme.webp" },
  { key: "facility.dept-8", page: "Tesisimiz", label: "Bölüm 8: Depo ve Sevkiyat", fallback: "/tesis/etiket.webp" },
  { key: "facility.warehouse", page: "Tesisimiz", label: "Depo bandı (ürün sayımı)", fallback: "/tesis/depo-sayim.webp" },
  { key: "about.intro", page: "Hakkımızda", label: "Hikâye 1: kuruluş / giriş", fallback: "/tesis/dis-cephe.webp" },
  { key: "about.mission", page: "Hakkımızda", label: "Hikâye 2: misyon", fallback: "/tesis/orme-salonu.webp" },
  { key: "about.vision", page: "Hakkımızda", label: "Hikâye 3: vizyon", fallback: "/tesis/dis-cephe-genis.webp" },
  { key: "about.facility", page: "Hakkımızda", label: "Hikâye 4: fabrikamız", fallback: "/tesis/dikim-2.webp" },
  { key: "about.principles", page: "Hakkımızda", label: "Hikâye 5: prensipler", fallback: "/tesis/kumas-kontrol.webp" },
  { key: "process.step-1", page: "Süreçlerimiz", label: "1. adım", fallback: "/tesis/arge.webp" },
  { key: "process.step-2", page: "Süreçlerimiz", label: "2. adım", fallback: "/tesis/orme-salonu-2.webp" },
  { key: "process.step-3", page: "Süreçlerimiz", label: "3. adım", fallback: "/tesis/iplik.webp" },
  { key: "process.step-4", page: "Süreçlerimiz", label: "4. adım", fallback: "/tesis/orme-yakin.webp" },
  { key: "process.step-5", page: "Süreçlerimiz", label: "5. adım", fallback: "/tesis/kalite-olcum.webp" },
  { key: "process.step-6", page: "Süreçlerimiz", label: "6. adım", fallback: "/tesis/dikim.webp" },
  { key: "process.step-7", page: "Süreçlerimiz", label: "7. adım", fallback: "/tesis/paketleme.webp" },
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
