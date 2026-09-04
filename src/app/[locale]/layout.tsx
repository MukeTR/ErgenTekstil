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
import { QuoteListProvider } from "@/components/quote/QuoteListProvider";
import QuoteListDrawer from "@/components/quote/QuoteListDrawer";
import { QuoteListFloatingButton } from "@/components/quote/QuoteListButton";
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

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${montserrat.variable} ${roboto.variable} ${robotoSlab.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-white text-brand-navy antialiased">
        <NextIntlClientProvider>
          <QuoteListProvider>
            <Header locale={locale} />
            <main className="flex-1">{props.children}</main>
            <Footer locale={locale} />
            <WhatsAppButton locale={locale} />
            <QuoteListFloatingButton />
            <QuoteListDrawer />
            <MetaPixel />
          </QuoteListProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
