import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCategoryKeys, getProducts } from "@/lib/data";
import PageHero from "@/components/PageHero";
import CatalogGrid from "@/components/CatalogGrid";

export const revalidate = 60;

export default async function CatalogPage(props: PageProps<"/[locale]/katalog">) {
  const { locale } = (await props.params) as { locale: Locale };
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "catalog" });
  const [products, categoryKeys] = await Promise.all([
    getProducts(locale),
    getCategoryKeys(),
  ]);

  const categoryLabels: Record<string, string> = {};
  for (const key of categoryKeys) {
    categoryLabels[key] = t(`categories.${key}` as "categories.Tayt");
  }

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <CatalogGrid
          products={products}
          categoryKeys={categoryKeys}
          categoryLabels={categoryLabels}
          allLabel={t("categories.all")}
        />
      </section>
    </>
  );
}
