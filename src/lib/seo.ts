import type { Locale } from "@/i18n/routing";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ergentekstil.com";

/**
 * Dil bazlı ana meta metinleri. Google'da "tayt üreticisi", "dikişsiz",
 * "seamless" gibi sorgularda görünmesi için anahtar kelimeler başlık ve
 * açıklamada doğal biçimde geçiyor.
 */
export const SEO: Record<
  Locale,
  { title: string; description: string; keywords: string[]; ogLocale: string }
> = {
  tr: {
    title: "Ergen Tekstil | Dikişsiz Tayt, Korse ve Spor Giyim Üreticisi",
    description:
      "Ergen Tekstil, 2004'ten beri dikişsiz (seamless) tayt, korse, şort, spor ve iç giyim üreticisi. 200.000 parça/ay kapasite, özel marka (private label) üretim, üç kıtaya ihracat. Toptan teklif alın.",
    keywords: [
      "dikişsiz tayt üreticisi",
      "tayt üreticisi",
      "seamless tayt",
      "dikişsiz korse",
      "korse üreticisi",
      "toptan tayt",
      "toptan korse",
      "dikişsiz spor giyim",
      "seamless giyim üretimi",
      "şekillendirici giyim üreticisi",
      "private label spor giyim",
      "Ergen Tekstil",
      "Formactive",
    ],
    ogLocale: "tr_TR",
  },
  en: {
    title: "Ergen Tekstil | Seamless Leggings, Shapewear & Activewear Manufacturer",
    description:
      "Ergen Tekstil has manufactured seamless leggings, shapewear, shorts, activewear and underwear since 2004. 200,000 pcs/month capacity, private label production, exporting to three continents. Request a wholesale quote.",
    keywords: [
      "seamless leggings manufacturer",
      "seamless activewear manufacturer",
      "shapewear manufacturer Turkey",
      "private label leggings",
      "wholesale seamless leggings",
      "seamless underwear manufacturer",
      "seamless garment factory Turkey",
      "Ergen Tekstil",
      "Formactive",
    ],
    ogLocale: "en_US",
  },
  ar: {
    title: "أرجن تكستيل | مصنع ليقنز ومشدّات وملابس رياضية بلا خياطة",
    description:
      "تُصنّع أرجن تكستيل منذ عام 2004 الليقنز والمشدّات والشورت والملابس الرياضية والداخلية بتقنية بلا خياطة (seamless). طاقة إنتاجية 200,000 قطعة شهريًا، إنتاج بعلامة خاصة، تصدير إلى ثلاث قارات. اطلب عرض سعر بالجملة.",
    keywords: [
      "مصنع ليقنز بلا خياطة",
      "مصنع مشدات تركيا",
      "ملابس رياضية بلا خياطة بالجملة",
      "ليقنز بالجملة تركيا",
      "مصنع ملابس داخلية بلا خياطة",
      "علامة خاصة ملابس رياضية",
      "Ergen Tekstil",
      "Formactive",
    ],
    ogLocale: "ar_AR",
  },
  de: {
    title: "Ergen Tekstil | Hersteller für Seamless-Leggings, Shapewear & Sportbekleidung",
    description:
      "Ergen Tekstil fertigt seit 2004 nahtlose (seamless) Leggings, Shapewear, Shorts, Sport- und Unterwäsche. 200.000 Teile/Monat, Private-Label-Produktion, Export auf drei Kontinente. Jetzt Großhandelsangebot anfordern.",
    keywords: [
      "Seamless Leggings Hersteller",
      "nahtlose Sportbekleidung Hersteller",
      "Shapewear Hersteller Türkei",
      "Private Label Leggings",
      "Leggings Großhandel Türkei",
      "nahtlose Unterwäsche Hersteller",
      "Seamless Textilfabrik Türkei",
      "Ergen Tekstil",
      "Formactive",
    ],
    ogLocale: "de_DE",
  },
  ru: {
    title: "Ergen Tekstil | Производитель бесшовных леггинсов, корректирующего белья и спортивной одежды",
    description:
      "Ergen Tekstil с 2004 года производит бесшовные (seamless) леггинсы, корректирующее бельё, шорты, спортивную и нижнюю одежду. 200 000 изделий в месяц, производство под частной маркой, экспорт на три континента. Запросите оптовое предложение.",
    keywords: [
      "производитель бесшовных леггинсов",
      "бесшовная спортивная одежда производитель",
      "корректирующее бельё производитель Турция",
      "леггинсы оптом Турция",
      "производство под частной маркой Турция",
      "бесшовное бельё производитель",
      "фабрика бесшовного трикотажа Турция",
      "Ergen Tekstil",
      "Formactive",
    ],
    ogLocale: "ru_RU",
  },
};

/** hreflang alternatifleri (next-intl localePrefix: "always") */
export function languageAlternates(path = "") {
  return {
    canonical: `${SITE_URL}/tr${path}`,
    languages: {
      tr: `${SITE_URL}/tr${path}`,
      en: `${SITE_URL}/en${path}`,
      ar: `${SITE_URL}/ar${path}`,
      de: `${SITE_URL}/de${path}`,
      ru: `${SITE_URL}/ru${path}`,
      "x-default": `${SITE_URL}/tr${path}`,
    },
  };
}
