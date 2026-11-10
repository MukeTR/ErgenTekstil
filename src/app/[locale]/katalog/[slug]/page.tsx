import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { getProduct, productImageUrl } from "@/lib/data";
import { PRODUCT_META_SUFFIX, SITE_URL, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import ProductGallery from "@/components/ProductGallery";
import ColorSwatches from "@/components/ColorSwatches";
import MetaViewContent from "@/components/MetaViewContent";

// Ürünler her istekte Supabase'den okunur: panelden yapılan değişiklik anında yansır
export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/[locale]/katalog/[slug]">
): Promise<Metadata> {
  const { locale, slug } = (await props.params) as { locale: Locale; slug: string };
  const product = await getProduct(locale, slug);
  if (!product) return { title: "Ergen Tekstil" };
  const description = [
    product.categoryKeys[0] === "Genel" ? "" : product.categories[0],
    product.features.slice(0, 4).join(", "),
    PRODUCT_META_SUFFIX[locale],
  ]
    .filter(Boolean)
    .join(". ");
  const meta = pageMetadata(locale, `/katalog/${slug}/`, product.name, description);
  const image = product.images[0] ? productImageUrl(product.images[0]) : undefined;
  return { ...meta, openGraph: { ...meta.openGraph, images: image ? [{ url: image }] : undefined } };
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
  const tn = await getTranslations({ locale, namespace: "nav" });

  const pageUrl = `${SITE_URL}/${locale}/katalog/${product.slug}/`;
  const absolute = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);
  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      url: pageUrl,
      image: product.images.slice(0, 6).map((i) => absolute(productImageUrl(i))),
      description: product.features.join(", "),
      category: product.categories.join(", "),
      color: product.colors.join(", ") || undefined,
      brand: { "@type": "Brand", name: "FORMactive" },
      manufacturer: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: tn("home"), item: `${SITE_URL}/${locale}/` },
        { "@type": "ListItem", position: 2, name: tn("catalog"), item: `${SITE_URL}/${locale}/katalog/` },
        { "@type": "ListItem", position: 3, name: product.name, item: pageUrl },
      ],
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd data={structured} />
      <MetaViewContent
        contentId={product.slug}
        contentName={product.name}
        category={product.categoryKeys[0]}
      />
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
            <p className="text-sm leading-relaxed text-brand-grey">{t("quoteIntro")}</p>
            <Link
              href={{ pathname: "/iletisim", query: { urun: product.name } }}
              className="mt-5 inline-block rounded-full bg-brand-navy px-7 py-3 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black"
            >
              {tn("contact")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
