import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getContent, getProducts } from "@/lib/data";
import { SITE_URL, pageMetadata } from "@/lib/seo";
import { LEGGINGS_LANDING } from "@/data/landing-leggings";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";

const PATH = "/seamless-tayt-ureticisi/";
const H2 = "font-heading text-3xl font-extrabold tracking-tight sm:text-4xl";

// Ürünler her istekte Supabase'den okunur
export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/[locale]/seamless-tayt-ureticisi">
): Promise<Metadata> {
  const { locale } = (await props.params) as { locale: Locale };
  const c = LEGGINGS_LANDING[locale];
  return { ...pageMetadata(locale, PATH, c.metaTitle, c.metaDescription), title: { absolute: c.metaTitle } };
}

export default async function LeggingsManufacturerPage(
  props: PageProps<"/[locale]/seamless-tayt-ureticisi">
) {
  const { locale } = (await props.params) as { locale: Locale };
  setRequestLocale(locale);

  const c = LEGGINGS_LANDING[locale];
  const content = getContent(locale);
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const products = (await getProducts(locale))
    .filter((p) => p.categoryKeys.some((k) => k === "Tayt" || k === "Şort"))
    .slice(0, 8);

  const url = `${SITE_URL}/${locale}${PATH}`;
  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: c.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: c.h1,
      serviceType: c.navLabel,
      description: c.metaDescription,
      url,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: ["Europe", "Africa", "Asia"],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: tn("home"), item: `${SITE_URL}/${locale}/` },
        { "@type": "ListItem", position: 2, name: c.navLabel, item: url },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={structured} />
      <PageHero title={c.h1} subtitle={c.kicker} image="/tesis/orme-salonu.webp" />

      {/* Giriş */}
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xl leading-relaxed text-brand-navy sm:text-2xl sm:leading-relaxed">
            {c.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/iletisim"
              className="rounded-full bg-brand-navy px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black"
            >
              {tc("requestQuote")}
            </Link>
            <Link
              href="/katalog"
              className="rounded-full border border-brand-navy/30 px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy transition hover:border-brand-navy"
            >
              {tn("catalog")}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Rakamlar */}
      <section className="border-y border-black/5 bg-brand-grey-light py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">{c.factsTitle}</h2>
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {c.facts.map((f, i) => (
              <Reveal key={f.label} delay={i * 80}>
                <dt className="font-heading text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
                  {f.value}
                </dt>
                <dd className="mt-2 text-sm font-medium text-brand-grey">{f.label}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Ürünler */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className={`${H2} text-brand-navy`}>{c.productsTitle}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-brand-grey">{c.productsText}</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <Link
          href="/katalog"
          className="mt-10 inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy underline underline-offset-4"
        >
          {tc("allProducts")} →
        </Link>
      </section>

      {/* İplik ve kumaş */}
      <section className="bg-brand-navy py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className={H2}>{c.fabricTitle}</h2>
            <p className="mt-4 max-w-3xl text-white/75">{c.fabricText}</p>
          </Reveal>
          <Reveal
            delay={120}
            className="mt-10 grid gap-x-10 gap-y-6 rounded-3xl bg-white px-6 py-10 sm:grid-cols-2 sm:px-10"
          >
            {[content.home.yarns, content.home.yarnFeatures].map((list, k) => (
              <ul key={k} className="space-y-3">
                {(list as string[]).map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-brand-grey">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy" />
                    {item}
                  </li>
                ))}
              </ul>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Süreç */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className={`${H2} text-brand-navy`}>{c.processTitle}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-brand-grey">{c.processText}</p>
        </Reveal>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.process.steps.map((s: { title: string }, i: number) => (
            <li key={s.title} className="rounded-2xl border border-black/5 p-5">
              <span className="font-heading text-2xl font-extrabold text-brand-navy/20">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-heading text-sm font-bold text-brand-navy">{s.title}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-6">
          <Link
            href="/sureclerimiz"
            className="font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy underline underline-offset-4"
          >
            {tn("process")} →
          </Link>
          <Link
            href="/tesisimiz"
            className="font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy underline underline-offset-4"
          >
            {tn("facility")} →
          </Link>
        </div>
      </section>

      {/* SSS */}
      <section className="bg-brand-grey-light py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className={`${H2} text-brand-navy`}>{c.faqTitle}</h2>
          <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
            {c.faq.map((f, i) => (
              <details key={f.q} className="group py-5" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-heading text-lg font-bold text-brand-navy">
                  <h3>{f.q}</h3>
                  <span className="text-2xl font-normal text-brand-navy/50 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-brand-grey">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Teklif çağrısı */}
      <section className="bg-brand-navy py-20 text-white">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <h2 className={H2}>{c.ctaTitle}</h2>
            <p className="mt-4 text-white/70">{c.ctaText}</p>
          </div>
          <Link
            href="/iletisim"
            className="shrink-0 rounded-full bg-white px-8 py-4 font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-white/90"
          >
            {tc("requestQuote")}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
