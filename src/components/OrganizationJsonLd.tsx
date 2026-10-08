import { SITE_URL } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import contentTr from "@/data/content.tr.json";

/**
 * Arama motorları ve yapay zekâ asistanları için kurumsal kimlik (schema.org).
 * Yalnız sitede yazan, doğrulanmış bilgiler: fabrika = genel merkez (Çerkezköy bölgesi,
 * resmî ilçe Kapaklı), satış ofisi = İstanbul Sirkeci şubesi. Adres metinleri
 * iletişim sayfasıyla aynı kaynaktan (content.tr.json) okunur, çelişki çıkmasın.
 */
export default function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const c = contentTr.contact;
  const capacity = contentTr.process.stats.find((s) => s.value > 1000)?.value;

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Ergen Tekstil",
    url: `${SITE_URL}/${locale}/`,
    logo: `${SITE_URL}/marka/logo-renkli.png`,
    foundingDate: "2004",
    email: c.email,
    telephone: c.phones[0],
    brand: { "@type": "Brand", name: "FORMactive" },
    description:
      "Dikişsiz (seamless) tayt, korse, şort, spor ve iç giyim üreticisi. Kendi fabrikasında örme, boyama, dikim ve paketleme; özel marka (private label) ve toptan B2B üretim." +
      (capacity ? ` Kapasite: ${capacity.toLocaleString("tr-TR")} parça/ay.` : ""),
    knowsAbout: ["seamless knitting", "seamless leggings", "shapewear", "activewear", "private label apparel"],
    areaServed: ["Europe", "Africa", "Asia"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Karaağaç OSB, Eski Bağlar Cad. No:6",
      postalCode: "59510",
      addressLocality: "Kapaklı (Çerkezköy)",
      addressRegion: "Tekirdağ",
      addressCountry: "TR",
    },
    location: [
      {
        "@type": "Place",
        name: c.headOfficeTitle,
        address: c.headOfficeAddress,
      },
      {
        "@type": "Place",
        name: c.branchTitle,
        address: c.branchAddress,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
