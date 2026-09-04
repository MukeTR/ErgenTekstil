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
  de: { Tayt: "Leggings", Korse: "Shapewear", Şort: "Shorts", Genel: "Allgemein" },
  ru: { Tayt: "Леггинсы", Korse: "Корректирующее бельё", Şort: "Шорты", Genel: "Общее" },
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
  "Vişne",
  "İndigo",
  "Kahve",
  "Koyu Kahve",
  "Füme",
  "Antrasit",
  "Bebe Mavisi",
  "Buz Mavisi",
  "Sarı",
  "Haki",
  "Gri",
  "Camel",
  "Hardal",
  "Lila",
  "Mint Yeşil",
  "Koyu Yeşil",
] as const;
export type ColorKey = (typeof COLOR_KEYS)[number];

const COLOR_LABELS: Record<Locale, Record<ColorKey, string>> = {
  tr: {
    Siyah: "Siyah", Beyaz: "Beyaz", Ten: "Ten", Lacivert: "Lacivert",
    Kırmızı: "Kırmızı", Mavi: "Mavi", Yeşil: "Yeşil", Pembe: "Pembe",
    Turuncu: "Turuncu", Kremit: "Kremit", Vişne: "Vişne", İndigo: "İndigo",
    Kahve: "Kahve", "Koyu Kahve": "Koyu Kahve", Füme: "Füme", Antrasit: "Antrasit",
    "Bebe Mavisi": "Bebe Mavisi", "Buz Mavisi": "Buz Mavisi", Sarı: "Sarı",
    Haki: "Haki", Gri: "Gri", Camel: "Camel", Hardal: "Hardal", Lila: "Lila",
    "Mint Yeşil": "Mint Yeşil", "Koyu Yeşil": "Koyu Yeşil",
  },
  en: {
    Siyah: "Black", Beyaz: "White", Ten: "Nude", Lacivert: "Navy",
    Kırmızı: "Red", Mavi: "Blue", Yeşil: "Green", Pembe: "Pink",
    Turuncu: "Orange", Kremit: "Terracotta", Vişne: "Burgundy", İndigo: "Indigo",
    Kahve: "Brown", "Koyu Kahve": "Dark Brown", Füme: "Smoke Grey", Antrasit: "Anthracite",
    "Bebe Mavisi": "Baby Blue", "Buz Mavisi": "Ice Blue", Sarı: "Yellow",
    Haki: "Khaki", Gri: "Grey", Camel: "Camel", Hardal: "Mustard", Lila: "Lilac",
    "Mint Yeşil": "Mint Green", "Koyu Yeşil": "Dark Green",
  },
  ar: {
    Siyah: "أسود", Beyaz: "أبيض", Ten: "بيج", Lacivert: "كحلي",
    Kırmızı: "أحمر", Mavi: "أزرق", Yeşil: "أخضر", Pembe: "وردي",
    Turuncu: "برتقالي", Kremit: "طوبي", Vişne: "خمري", İndigo: "نيلي",
    Kahve: "بني", "Koyu Kahve": "بني غامق", Füme: "رمادي مدخن", Antrasit: "أنثراسايت",
    "Bebe Mavisi": "أزرق فاتح", "Buz Mavisi": "أزرق جليدي", Sarı: "أصفر",
    Haki: "كاكي", Gri: "رمادي", Camel: "جملي", Hardal: "خردلي", Lila: "بنفسجي فاتح",
    "Mint Yeşil": "أخضر نعناعي", "Koyu Yeşil": "أخضر غامق",
  },
  de: {
    Siyah: "Schwarz", Beyaz: "Weiß", Ten: "Nude", Lacivert: "Marineblau",
    Kırmızı: "Rot", Mavi: "Blau", Yeşil: "Grün", Pembe: "Rosa",
    Turuncu: "Orange", Kremit: "Terrakotta", Vişne: "Bordeaux", İndigo: "Indigo",
    Kahve: "Braun", "Koyu Kahve": "Dunkelbraun", Füme: "Rauchgrau", Antrasit: "Anthrazit",
    "Bebe Mavisi": "Babyblau", "Buz Mavisi": "Eisblau", Sarı: "Gelb",
    Haki: "Khaki", Gri: "Grau", Camel: "Camel", Hardal: "Senfgelb", Lila: "Flieder",
    "Mint Yeşil": "Mintgrün", "Koyu Yeşil": "Dunkelgrün",
  },
  ru: {
    Siyah: "Чёрный", Beyaz: "Белый", Ten: "Телесный", Lacivert: "Тёмно-синий",
    Kırmızı: "Красный", Mavi: "Синий", Yeşil: "Зелёный", Pembe: "Розовый",
    Turuncu: "Оранжевый", Kremit: "Терракотовый", Vişne: "Вишнёвый", İndigo: "Индиго",
    Kahve: "Коричневый", "Koyu Kahve": "Тёмно-коричневый", Füme: "Дымчато-серый", Antrasit: "Антрацит",
    "Bebe Mavisi": "Нежно-голубой", "Buz Mavisi": "Ледяной голубой", Sarı: "Жёлтый",
    Haki: "Хаки", Gri: "Серый", Camel: "Кэмел", Hardal: "Горчичный", Lila: "Сиреневый",
    "Mint Yeşil": "Мятный", "Koyu Yeşil": "Тёмно-зелёный",
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
  Vişne: "#7b2d3d",
  İndigo: "#3d4a7a",
  Kahve: "#6b4423",
  "Koyu Kahve": "#4a2c17",
  Füme: "#5c5c5c",
  Antrasit: "#36393f",
  "Bebe Mavisi": "#a8c8e8",
  "Buz Mavisi": "#c5e0f0",
  Sarı: "#e8c547",
  Haki: "#6b7047",
  Gri: "#8c8c8c",
  Camel: "#c19a6b",
  Hardal: "#c9972a",
  Lila: "#c8a2c8",
  "Mint Yeşil": "#a8d5ba",
  "Koyu Yeşil": "#2d4a2d",
};
