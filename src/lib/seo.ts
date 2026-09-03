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
};

/** hreflang alternatifleri (next-intl localePrefix: "always") */
export function languageAlternates(path = "") {
  return {
    canonical: `${SITE_URL}/tr${path}`,
    languages: {
      tr: `${SITE_URL}/tr${path}`,
      en: `${SITE_URL}/en${path}`,
      ar: `${SITE_URL}/ar${path}`,
      "x-default": `${SITE_URL}/tr${path}`,
    },
  };
}
