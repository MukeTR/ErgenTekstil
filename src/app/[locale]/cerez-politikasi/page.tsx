import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import LegalPage from "@/components/LegalPage";

export default async function Page(props: PageProps<"/[locale]/cerez-politikasi">) {
  const { locale } = (await props.params) as { locale: Locale };
  setRequestLocale(locale);
  return <LegalPage slug="cerez-politikasi" locale={locale} />;
}
