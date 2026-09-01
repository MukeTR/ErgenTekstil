import type { Metadata } from "next";
import { Montserrat, Roboto, Roboto_Slab } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
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
  return {
    title: {
      default: `${t("company")} | ${t("brand")}`,
      template: `%s | ${t("company")}`,
    },
    description:
      locale === "tr"
        ? "Ergen Tekstil, 2004'ten bu yana dikişsiz spor, iç ve şekillendirici giyim üretip üç kıtaya ihraç ediyor."
        : locale === "ar"
          ? "تُصنّع أرجن تكستيل منذ عام 2004 الملابس الرياضية والداخلية والمشكّلة للجسم بلا خياطة وتصدّرها إلى ثلاث قارات."
          : "Since 2004, Ergen Tekstil has manufactured seamless sportswear, underwear and shapewear, exporting to three continents.",
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
          <Header locale={locale} />
          <main className="flex-1">{props.children}</main>
          <Footer locale={locale} />
          <WhatsAppButton locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
