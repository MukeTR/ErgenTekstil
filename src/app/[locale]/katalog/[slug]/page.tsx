import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getProduct } from "@/lib/data";
import ProductGallery from "@/components/ProductGallery";
import ColorSwatches from "@/components/ColorSwatches";

export const revalidate = 60;

export async function generateMetadata(
  props: PageProps<"/[locale]/katalog/[slug]">
) {
  const { locale, slug } = (await props.params) as { locale: Locale; slug: string };
  const product = await getProduct(locale, slug);
  return { title: product?.name ?? "Ergen Tekstil" };
}

export default async function ProductPage(
  props: PageProps<"/[locale]/katalog/[slug]">
) {
  const { locale, slug } = (await props.params) as { locale: Locale; slug: string };
  setRequestLocale(locale);

  const product = await getProduct(locale, slug);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: "product" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/katalog"
        className="inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey hover:text-brand-navy"
      >
        ← {t("backToCatalog")}
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {product.categories[0] && (
            <span className="font-heading text-xs font-semibold uppercase tracking-widest text-brand-grey">
              {product.categories[0]}
            </span>
          )}
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-brand-navy">
            {product.name}
          </h1>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <h2 className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey">
                {tc("colors")}
              </h2>
              <div className="mt-3">
                <ColorSwatches colors={product.colors} colorKeys={product.colorKeys} />
              </div>
            </div>
          )}

          {product.features.length > 0 && (
            <div className="mt-8">
              <h2 className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey">
                {tc("features")}
              </h2>
              <ul className="mt-3 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-brand-grey">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 rounded-2xl bg-brand-grey-light p-6">
            <p className="text-sm text-brand-grey">{t("quoteIntro")}</p>
            <Link
              href={{ pathname: "/iletisim", query: { urun: product.name } }}
              className="mt-4 inline-block rounded-full bg-brand-navy px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black"
            >
              {tc("requestQuote")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
