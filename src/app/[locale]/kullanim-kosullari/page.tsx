import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import LegalPage from "@/components/LegalPage";

export default async function Page(props: PageProps<"/[locale]/kullanim-kosullari">) {
  const { locale } = (await props.params) as { locale: Locale };
  setRequestLocale(locale);
  return <LegalPage slug="kullanim-kosullari" locale={locale} />;
}
