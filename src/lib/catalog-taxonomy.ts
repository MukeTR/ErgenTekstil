import type { Locale } from "@/i18n/routing";

// Canonical (TR) keys the admin picks from — these map to the same
// translation dictionaries the legacy static catalogue used, so a product
// created in the admin panel renders correctly in all three locales
// without needing per-locale category/colour text to be typed by hand.

export const CATEGORY_KEYS = ["Tayt", "Korse", "Şort", "Genel"] as const;
export type CategoryKey = (typeof CATEGORY_KEYS)[number];

const CATEGORY_LABELS: Record<Locale, Record<CategoryKey, string>> = {
  tr: { Tayt: "Tayt", Korse: "Korse", Şort: "Şort", Genel: "Genel" },
  en: { Tayt: "Leggings", Korse: "Shapewear", Şort: "Shorts", Genel: "General" },
  ar: { Tayt: "طماق", Korse: "مشدّات", Şort: "شورت", Genel: "عام" },
};

export function categoryLabel(locale: Locale, key: string): string {
  return CATEGORY_LABELS[locale][key as CategoryKey] ?? key;
}

export const COLOR_KEYS = [
  "Siyah",
  "Beyaz",
  "Ten",
  "Lacivert",
  "Kırmızı",
  "Mavi",
  "Yeşil",
  "Pembe",
  "Turuncu",
  "Kremit",
] as const;
export type ColorKey = (typeof COLOR_KEYS)[number];

const COLOR_LABELS: Record<Locale, Record<ColorKey, string>> = {
  tr: {
    Siyah: "Siyah", Beyaz: "Beyaz", Ten: "Ten", Lacivert: "Lacivert",
    Kırmızı: "Kırmızı", Mavi: "Mavi", Yeşil: "Yeşil", Pembe: "Pembe",
    Turuncu: "Turuncu", Kremit: "Kremit",
  },
  en: {
    Siyah: "Black", Beyaz: "White", Ten: "Nude", Lacivert: "Navy",
    Kırmızı: "Red", Mavi: "Blue", Yeşil: "Green", Pembe: "Pink",
    Turuncu: "Orange", Kremit: "Terracotta",
  },
  ar: {
    Siyah: "أسود", Beyaz: "أبيض", Ten: "بيج", Lacivert: "كحلي",
    Kırmızı: "أحمر", Mavi: "أزرق", Yeşil: "أخضر", Pembe: "وردي",
    Turuncu: "برتقالي", Kremit: "طوبي",
  },
};

export function colorLabel(locale: Locale, key: string): string {
  return COLOR_LABELS[locale][key as ColorKey] ?? key;
}

export const COLOR_HEX: Record<ColorKey, string> = {
  Mavi: "#2b5aa8",
  Kremit: "#b5603a",
  Pembe: "#e39ab0",
  Kırmızı: "#c02a2a",
  Siyah: "#111111",
  Turuncu: "#e0722a",
  Yeşil: "#3f7a4f",
  Lacivert: "#1c2c52",
  Beyaz: "#f5f5f5",
  Ten: "#d9b599",
};
