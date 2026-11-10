import type { Metadata } from "next";
import { Montserrat, Roboto, Roboto_Slab } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SEO, SITE_URL } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MetaPixel from "@/components/MetaPixel";
import JsonLd from "@/components/JsonLd";
import { getContent } from "@/lib/data";
import { FACTORY_COORDS } from "@/lib/location";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600", "700", "800"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "700"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "700"],
});

// Başlık/mobil menü ve sayfa görselleri panelden (Supabase) okunur: değişiklik anında yansısın
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "common" });
  const seo = SEO[locale as Locale] ?? SEO.tr;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.title,
      template: `%s | ${t("company")}`,
    },
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      type: "website",
      siteName: t("company"),
      locale: seo.ogLocale,
      url: `${SITE_URL}/${locale}`,
      title: seo.title,
      description: seo.description,
      images: [{ url: "/images/factory-floor.webp", width: 1920, height: 800 }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";
  const seo = SEO[locale as Locale] ?? SEO.tr;
  const contact = getContent(locale as Locale).contact;
  const organization = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "Manufacturer"],
        "@id": `${SITE_URL}/#organization`,
        name: "Ergen Tekstil",
        legalName: "Ergen Tekstil ve İnşaat Sanayi Ticaret Limited Şirketi",
        url: `${SITE_URL}/${locale}/`,
        logo: `${SITE_URL}/marka/logo-renkli.png`,
        image: `${SITE_URL}/tesis/dis-cephe.webp`,
        description: seo.description,
        foundingDate: "2004",
        email: contact.email,
        telephone: contact.phones[0],
        brand: { "@type": "Brand", name: "FORMactive" },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Karaağaç OSB, Eski Bağlar Caddesi No:6",
          addressLocality: "Kapaklı",
          addressRegion: "Tekirdağ",
          postalCode: "59510",
          addressCountry: "TR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: FACTORY_COORDS.lat,
          longitude: FACTORY_COORDS.lng,
        },
        areaServed: ["Europe", "Africa", "Asia"],
        knowsAbout: seo.keywords,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: contact.email,
          telephone: contact.phones[0],
          availableLanguage: ["tr", "en", "ar", "de", "ru"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: "Ergen Tekstil",
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${montserrat.variable} ${roboto.variable} ${robotoSlab.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-white text-brand-navy antialiased">
        <NextIntlClientProvider>
          <Header locale={locale} />
          <main className="flex-1">{props.children}</main>
          <Footer locale={locale} />
          <WhatsAppButton locale={locale} />
          <MetaPixel />
          <JsonLd data={organization} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
