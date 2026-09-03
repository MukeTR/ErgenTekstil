import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { blogImageUrl, getBlogPosts, getContent, getProducts } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import StatCounter from "@/components/StatCounter";
import CollectionIcon from "@/components/CollectionIcon";
import CatalogueDownloadForm from "@/components/CatalogueDownloadForm";

const PROCESS_VIDEOS = [
  "/video/process-1.mp4",
  "/video/process-2.mp4",
  "/video/process-3.mp4",
  "/video/process-4.mp4",
];

export const revalidate = 60;

export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = (await props.params) as { locale: Locale };
  setRequestLocale(locale);

  const c = getContent(locale).home;
  const process = getContent(locale).process;
  const tc = await getTranslations({ locale, namespace: "common" });
  const tcat = await getTranslations({ locale, namespace: "catalogues" });
  const tblog = await getTranslations({ locale, namespace: "homeBlog" });
  const allProducts = await getProducts(locale);
  const products = allProducts.slice(0, 4);
  const latestPosts = getBlogPosts(locale).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[86vh] items-center overflow-hidden bg-brand-navy text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-brand-navy/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <span className="inline-block rounded-full border border-white/30 px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-widest text-white/80">
            {c.heroBadge}
          </span>
          <h1 className="mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
            {c.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">{c.heroSubtitle}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/katalog"
              className="rounded-full bg-white px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-white/90"
            >
              {tc("allProducts")}
            </Link>
            <Link
              href="/iletisim"
              className="rounded-full border border-white/40 px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white"
            >
              {tc("requestQuote")}
            </Link>
          </div>
        </div>
      </section>

      {/* About / experience */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-brand-grey">
              {c.aboutBadge}
            </span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold text-brand-navy sm:text-4xl">
              {c.aboutTitle}
            </h2>
            <p className="mt-6 text-brand-grey leading-relaxed">{c.aboutText}</p>
            <Link
              href="/hakkimizda"
              className="mt-8 inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy underline underline-offset-4"
            >
              {tc("learnMore")}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {c.processSteps.map((step: string, i: number) => (
              <div
                key={step}
                className={`rounded-2xl bg-brand-grey-light p-8 ${i % 2 === 1 ? "mt-8" : ""}`}
              >
                <span className="font-heading text-3xl font-extrabold text-brand-navy/20">
                  0{i + 1}
                </span>
                <p className="mt-4 font-heading text-sm font-bold uppercase tracking-wide text-brand-navy">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="bg-brand-grey-light py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-extrabold text-brand-navy sm:text-4xl">
            {c.collectionsTitle}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.collections.map(
              (col: {
                icon: string;
                title: string;
                description: string;
                highlight?: boolean;
              }) => (
                <div
                  key={col.title}
                  className={`rounded-2xl p-7 shadow-sm ${
                    col.highlight
                      ? "bg-gradient-to-br from-brand-navy to-[#3a2e6e] text-white"
                      : "bg-white text-brand-navy"
                  }`}
                >
                  <CollectionIcon
                    name={col.icon}
                    className={`h-10 w-10 ${col.highlight ? "text-white" : "text-brand-navy"}`}
                  />
                  <h3 className="mt-5 font-heading text-lg font-bold">{col.title}</h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      col.highlight ? "text-white/80" : "text-brand-grey"
                    }`}
                  >
                    {col.description}
                  </p>
                  <Link
                    href="/katalog"
                    className={`mt-5 inline-flex items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-wide underline underline-offset-4 ${
                      col.highlight ? "text-white" : "text-brand-navy"
                    }`}
                  >
                    {tc("viewCollection")} →
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-3xl font-extrabold text-brand-navy sm:text-4xl">
            {tc("brand")}
          </h2>
          <Link
            href="/katalog"
            className="hidden font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy underline underline-offset-4 sm:inline"
          >
            {tc("allProducts")}
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Product catalogues */}
      <section className="bg-brand-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
            {tcat("title")}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {c.catalogues.map((name: string) => (
              <div key={name} className="rounded-2xl bg-white/5 p-6">
                <h3 className="font-heading text-base font-bold">{name}</h3>
                <CatalogueDownloadForm
                  catalogueName={name}
                  placeholder={tcat("emailPlaceholder")}
                  buttonLabel={tcat("download")}
                  successMessage={tcat("success")}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog teaser */}
      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-heading text-3xl font-extrabold text-brand-navy sm:text-4xl">
              {tblog("title")}
            </h2>
            <Link
              href="/blog"
              className="hidden font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy underline underline-offset-4 sm:inline"
            >
              {tblog("viewAll")}
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-2xl bg-brand-grey-light"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy/5">
                  {post.image && (
                    <Image
                      src={blogImageUrl(post.image)}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-base font-bold text-brand-navy">
                    {post.title}
                  </h3>
                  <span className="mt-3 inline-block font-heading text-xs font-semibold uppercase tracking-wide text-brand-navy/60">
                    {tc("readMore")} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Colour */}
      <section className="relative overflow-hidden bg-brand-navy py-24 text-white">
        <Image
          src="/marka/bg-sidea.webp"
          alt=""
          fill
          className="object-cover opacity-20"
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">{c.colorTitle}</h2>
          <p className="mt-4 text-white/70">{c.colorText}</p>
        </div>
      </section>

      {/* Process teaser */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-brand-navy sm:text-4xl">
              {c.processTitle}
            </h2>
            <p className="mt-6 max-w-md text-brand-grey leading-relaxed">{c.processText}</p>
            <Link
              href="/sureclerimiz"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black"
            >
              {tc("learnMore")}
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {PROCESS_VIDEOS.map((src) => (
              <div
                key={src}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-grey-light"
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                >
                  <source src={src} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yarns and technology */}
      <section className="bg-brand-navy py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold uppercase sm:text-3xl">
            {c.yarnTitle}
          </h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-x-10 gap-y-6 bg-white px-4 py-10 sm:grid-cols-2 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {c.yarns.map((yarn: string) => (
              <div key={yarn} className="flex gap-3 text-sm text-brand-grey">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy" />
                {yarn}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {c.yarnFeatures.map((feature: string) => (
              <div key={feature} className="flex gap-3 text-sm text-brand-grey">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-grey-light py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6">
            {process.stats.map((s: { value: number; label: string }) => (
              <StatCounter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <span className="font-heading text-xs font-bold uppercase tracking-widest text-brand-grey">
          {c.valuesBadge}
        </span>
        <p className="mt-4 max-w-2xl text-brand-grey">{c.valuesText}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {c.values.map((v: { title: string; text: string }) => (
            <div key={v.title} className="rounded-2xl border border-black/5 p-6">
              <h3 className="font-heading text-base font-bold text-brand-navy">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-grey">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-navy py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
            {tc("requestQuote")}
          </h2>
          <p className="mt-4 text-white/70">{c.aboutText.slice(0, 140)}…</p>
          <Link
            href="/iletisim"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-white/90"
          >
            {tc("requestQuote")}
          </Link>
        </div>
      </section>
    </>
  );
}
