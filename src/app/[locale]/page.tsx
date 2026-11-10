import Image from "next/image";
import type { Metadata } from "next";
import { SEO, SITE_URL, languageAlternates } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { blogImageUrl, getBlogPosts, getContent, getFeaturedProducts } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import StatCounter from "@/components/StatCounter";
import CatalogueDownloadForm from "@/components/CatalogueDownloadForm";
import NewsletterForm from "@/components/NewsletterForm";
import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";

// Ürün görselleri sitenin kendi kopyasından (public/urunler/sb) gelir; Supabase'e bağımlı değil.
const P = "/urunler/sb";

function buildHeroSlides(c: {
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroText: string;
  heroTagline: string;
  heroTaglineSub: string;
}): HeroSlide[] {
  return [
    {
      kicker: "Seamless Activewear",
      title: c.heroTitle,
      subtitle: c.heroSubtitle,
      images: [
        `${P}/1510/0-Y1.png.webp`,
        `${P}/1550/0-ATOS6988.jpg.webp`,
        `${P}/1700/0-ATOS0799.jpg.webp`,
      ],
    },
    {
      kicker: "FORMactive",
      title: c.heroBadge,
      subtitle: c.heroText,
      images: [
        `${P}/1725/0-ATOS0946.jpg.webp`,
        `${P}/1610-1625/0-1.jpg.webp`,
        `${P}/1430/0-FAC_3550.jpg.webp`,
      ],
    },
    {
      kicker: "Shapewear",
      title: c.heroTagline,
      subtitle: c.heroTaglineSub,
      images: [
        `${P}/1060/0-FAC_2166.jpg.webp`,
        `${P}/2210/0-FAC_3357.jpg.webp`,
        `${P}/1040/0-FAC_1222.jpg.webp`,
      ],
    },
  ];
}

// Koleksiyon kutuları: spor grupları önde, her birinin kendi ürün fotoğrafı.
// Anahtar, içerik dosyalarındaki "icon" alanıdır (5 dilde ortak).
const COLLECTION_TILES: { icon: string; image: string }[] = [
  { icon: "shorts", image: `${P}/1510/2-Y3.png.webp` },
  { icon: "tank", image: `${P}/1550/0-ATOS6988.jpg.webp` },
  { icon: "polo", image: `${P}/6100-6200/0-I_C_LI_K_1.png.webp` },
  { icon: "leggings", image: `${P}/1700/0-ATOS0799.jpg.webp` },
  { icon: "bra", image: `${P}/2020/0-FAC_2900.jpg.webp` },
  { icon: "corset", image: `${P}/1060/0-FAC_2166.jpg.webp` },
];

const PROCESS_VIDEOS = [
  "/video/process-1.mp4",
  "/video/process-2.mp4",
  "/video/process-3.mp4",
  "/video/process-4.mp4",
];

const H2 = "slash text-4xl sm:text-6xl";
const KICKER =
  "font-heading text-xs font-bold uppercase tracking-[0.2em]";
const TEXT_LINK =
  "font-heading text-sm font-bold uppercase tracking-wide underline decoration-brand-volt decoration-[3px] underline-offset-8";

export async function generateMetadata(props: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = (await props.params) as { locale: Locale };
  const seo = SEO[locale] ?? SEO.tr;
  const alt = languageAlternates();
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: `${SITE_URL}/${locale}`, languages: alt.languages },
  };
}

export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = (await props.params) as { locale: Locale };
  setRequestLocale(locale);

  const c = getContent(locale).home;
  const process = getContent(locale).process;
  const about = getContent(locale).about;
  const tc = await getTranslations({ locale, namespace: "common" });
  const tcat = await getTranslations({ locale, namespace: "catalogues" });
  const tblog = await getTranslations({ locale, namespace: "homeBlog" });
  const products = await getFeaturedProducts(locale);
  const latestPosts = getBlogPosts(locale).slice(0, 3);

  type Collection = { icon: string; title: string; description: string };
  const collections = COLLECTION_TILES.flatMap((tile) => {
    const col = (c.collections as Collection[]).find((x) => x.icon === tile.icon);
    return col ? [{ ...col, image: tile.image }] : [];
  });
  const marquee = [...c.yarnFeatures, ...c.processList] as string[];

  return (
    <>
      {/* Hero */}
      <HeroSlider
        slides={buildHeroSlides(c)}
        allProductsLabel={tc("allProducts")}
        requestQuoteLabel={tc("requestQuote")}
      />

      {/* Kayan şerit: kumaş ve üretim özellikleri */}
      <div className="overflow-hidden bg-brand-volt py-3 text-brand-ink" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center">
              {marquee.map((item) => (
                <span
                  key={`${n}-${item}`}
                  className="font-display flex items-center gap-6 pe-6 text-xl sm:text-2xl"
                >
                  {item}
                  <span className="inline-block h-4 w-1.5 -skew-x-12 bg-brand-ink" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Koleksiyonlar: ürün fotoğraflı kutular */}
      <section className="mx-auto max-w-[96rem] px-4 py-20 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className={`${H2} slash-navy text-brand-navy`}>{c.collectionsTitle}</h2>
          <Link href="/katalog" className={`${TEXT_LINK} hidden text-brand-navy sm:inline`}>
            {tc("allProducts")}
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {collections.map((col, i) => (
            <Link
              key={col.icon}
              href="/katalog"
              className="group relative block aspect-[3/4] overflow-hidden bg-brand-ink sm:aspect-[4/5]"
            >
              <Image
                src={col.image}
                alt={col.title}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover object-top transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/25 to-transparent" />
              <span className="font-display absolute end-4 top-3 text-4xl text-white/80 sm:text-5xl">
                0{i + 1}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-7">
                <h3 className="font-display text-2xl leading-none sm:text-4xl">{col.title}</h3>
                <p className="mt-3 hidden max-w-sm text-sm leading-relaxed text-white/75 sm:block">
                  {col.description}
                </p>
                <span className="tag-sport mt-4 bg-brand-volt py-1.5 font-heading text-[11px] font-bold uppercase tracking-widest text-brand-ink transition group-hover:bg-white">
                  {tc("viewCollection")} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Öne çıkan spor ürünleri */}
      <section className="bg-brand-grey-light py-20">
        <div className="mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className={`${H2} slash-navy text-brand-navy`}>{tc("brand")}</h2>
            <Link href="/katalog" className={`${TEXT_LINK} hidden text-brand-navy sm:inline`}>
              {tc("allProducts")}
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Rakamlar */}
      <section className="relative overflow-hidden bg-brand-ink py-16 text-white">
        <div className="ink-texture absolute inset-0" />
        <div className="relative mx-auto grid max-w-5xl grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
          {process.stats.map((s: { value: number; suffix?: string; label: string }) => (
            <StatCounter
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              tone="dark"
            />
          ))}
        </div>
      </section>

      {/* Hakkımızda + üretim adımları */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className={`${KICKER} text-brand-grey`}>{c.aboutBadge}</span>
            <h2 className={`${H2} slash-navy mt-4 text-brand-navy`}>{c.aboutTitle}</h2>
            <p className="mt-6 leading-relaxed text-brand-grey">{c.aboutText}</p>
            <Link href="/hakkimizda" className={`${TEXT_LINK} mt-8 inline-block text-brand-navy`}>
              {tc("learnMore")}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {c.processSteps.map((step: string, i: number) => (
              <div
                key={step}
                className={`border-s-4 p-7 ${
                  i % 2 === 1
                    ? "mt-8 border-brand-volt bg-brand-ink text-white"
                    : "border-brand-ink bg-brand-grey-light text-brand-navy"
                }`}
              >
                <span className="font-display text-5xl opacity-40">0{i + 1}</span>
                <p className="font-display mt-3 text-2xl">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Süreç videoları */}
      <section className="relative overflow-hidden bg-brand-ink py-20 text-white">
        <div className="ink-texture absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <h2 className={H2}>{c.processTitle}</h2>
            <p className="mt-6 max-w-md leading-relaxed text-white/75">{c.processText}</p>
            <div className="mt-8 ps-2">
              <Link
                href="/sureclerimiz"
                className="btn-sport bg-brand-volt px-7 py-3.5 font-heading text-sm font-bold uppercase tracking-wide text-brand-ink transition hover:bg-white"
              >
                {tc("learnMore")}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 px-3 sm:gap-3">
            {PROCESS_VIDEOS.map((src, i) => (
              <div
                key={src}
                className={`relative aspect-[9/16] -skew-x-6 overflow-hidden bg-white/5 ${
                  i % 2 === 1 ? "translate-y-4" : ""
                }`}
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full skew-x-6 scale-[1.2] object-cover"
                >
                  <source src={src} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* İplikler ve teknoloji */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className={`${H2} slash-navy text-brand-navy`}>{c.yarnTitle}</h2>
        <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-2">
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {c.yarns.map((yarn: string) => (
              <li
                key={yarn}
                className="flex items-center gap-3 border-b border-black/10 py-3 text-sm text-brand-grey"
              >
                <span className="h-3 w-1.5 shrink-0 -skew-x-12 bg-brand-ink" />
                {yarn}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap content-start gap-2.5 ps-2">
            {c.yarnFeatures.map((feature: string, i: number) => (
              <span
                key={feature}
                className={`btn-sport px-5 py-2.5 font-heading text-xs font-bold uppercase tracking-wide ${
                  i % 3 === 0
                    ? "bg-brand-volt text-brand-ink"
                    : "bg-brand-ink text-white"
                }`}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Ürün katalogları */}
      <section className="relative overflow-hidden bg-brand-navy py-20 text-white">
        <div className="ink-texture absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className={H2}>{tcat("title")}</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {c.catalogues.map((name: string) => (
              <div key={name} className="border-t-4 border-brand-volt bg-white/5 p-6">
                <h3 className="font-display text-2xl leading-tight">{name}</h3>
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

      {/* Renkler */}
      <section className="relative overflow-hidden bg-brand-ink py-24 text-white">
        <Image src="/marka/bg-sidea.webp" alt="" fill className="object-cover opacity-25" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-5xl sm:text-7xl">{c.colorTitle}</h2>
          <p className="mt-5 text-white/75">{c.colorText}</p>
        </div>
      </section>

      {/* Değerler */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <span className={`${KICKER} text-brand-grey`}>{c.valuesBadge}</span>
        <p className="mt-4 max-w-2xl text-brand-grey">{c.valuesText}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.values.map((v: { title: string; text: string }, i: number) => (
            <div key={v.title} className="border-t-4 border-brand-ink bg-brand-grey-light p-6">
              <span className="font-display text-4xl text-brand-navy/25">0{i + 1}</span>
              <h3 className="font-display mt-2 text-2xl leading-tight text-brand-navy">
                {v.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-grey">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Büyüme / vizyon */}
      <section className="relative overflow-hidden bg-brand-ink py-24 text-white">
        <Image
          src="/images/factory-floor.webp"
          alt=""
          fill
          className="object-cover opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/90 to-brand-ink/30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="tag-sport bg-brand-volt py-1 font-heading text-[11px] font-bold uppercase tracking-widest text-brand-ink">
              {c.growthBadge}
            </span>
            <h2 className="mt-5 text-5xl sm:text-7xl">{c.growthTitle}</h2>
            <p className="mt-6 leading-relaxed text-white/75">{about.visionText}</p>
            <div className="mt-8 ps-2">
              <Link
                href="/hakkimizda"
                className="btn-sport border-2 border-white/50 px-7 py-3 font-heading text-sm font-bold uppercase tracking-wide text-white transition hover:border-brand-volt hover:text-brand-volt"
              >
                {c.growthLinkLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className={`${H2} slash-navy text-brand-navy`}>{tblog("title")}</h2>
            <Link href="/blog" className={`${TEXT_LINK} hidden text-brand-navy sm:inline`}>
              {tblog("viewAll")}
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden bg-brand-grey-light"
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
                <div className="border-t-2 border-brand-ink p-5 transition-colors group-hover:border-brand-volt">
                  <h3 className="font-heading text-base font-bold text-brand-navy">
                    {post.title}
                  </h3>
                  <span className="mt-3 inline-block font-heading text-xs font-bold uppercase tracking-wide text-brand-navy/60">
                    {tc("readMore")} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bülten */}
      <section className="bg-brand-grey-light py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl text-brand-navy sm:text-5xl">{c.newsletterTitle}</h2>
          <p className="mt-4 max-w-xl text-brand-grey">{c.newsletterText}</p>
          <NewsletterForm
            placeholder={c.newsletterPlaceholder}
            buttonLabel={c.newsletterButton}
            successMessage={c.newsletterSuccess}
          />
        </div>
      </section>

      {/* Teklif çağrısı */}
      <section className="relative overflow-hidden bg-brand-volt py-20 text-brand-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-6xl sm:text-8xl">{tc("requestQuote")}</h2>
            <p className="mt-4 text-brand-ink/75">{c.heroSubtitle}</p>
          </div>
          <div className="ps-2">
            <Link
              href="/iletisim"
              className="btn-sport bg-brand-ink px-10 py-5 font-heading text-base font-bold uppercase tracking-wide text-white transition hover:bg-brand-navy"
            >
              {tc("requestQuote")} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
