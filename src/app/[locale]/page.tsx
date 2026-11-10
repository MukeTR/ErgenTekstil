import Image from "next/image";
import type { Metadata } from "next";
import { SEO, SITE_URL, languageAlternates } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { blogImageUrl, getBlogPosts, getContent } from "@/lib/data";
import StatCounter from "@/components/StatCounter";
import Reveal from "@/components/Reveal";
import AutoVideo from "@/components/AutoVideo";
import CatalogueDownloadForm from "@/components/CatalogueDownloadForm";
import NewsletterForm from "@/components/NewsletterForm";
import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";
import { getActiveHeroSlides, getSiteImages, localized, type SiteImageKey } from "@/lib/site-media";

const HERO_PRODUCT_IMAGE_BASE =
  "https://mxjyyywiooxikcwfylys.supabase.co/storage/v1/object/public/product-images";

// Panelde (hero_slides) slayt yoksa kullanılan yedek: panel öncesi sabit slider
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
      title: c.heroTitle,
      subtitle: c.heroSubtitle,
      images: [
        "/images/factory-floor.webp",
        "/blog/Fuar-Blog.webp",
        "/sureclerimiz/step-7-dikim.webp",
      ],
    },
    {
      title: c.heroBadge,
      subtitle: c.heroText,
      images: [
        `${HERO_PRODUCT_IMAGE_BASE}/1510/0-Y1.png.webp`,
        `${HERO_PRODUCT_IMAGE_BASE}/1550/0-ATOS6988.jpg.webp`,
        `${HERO_PRODUCT_IMAGE_BASE}/1625/0-ATOS4165.jpg.webp`,
      ],
    },
    {
      title: c.heroTagline,
      subtitle: c.heroTaglineSub,
      images: [
        `${HERO_PRODUCT_IMAGE_BASE}/1060/0-FAC_2166.jpg.webp`,
        `${HERO_PRODUCT_IMAGE_BASE}/2210/0-FAC_3357.jpg.webp`,
        `${HERO_PRODUCT_IMAGE_BASE}/1040/0-FAC_1222.jpg.webp`,
      ],
    },
  ];
}

// Fabrikamızdan kısa, sessiz döngüler (Ekim 2026 çekimi)
const FACILITY_CLIPS = [
  { src: "/video/tesis/orme.mp4", poster: "/tesis/orme-salonu.webp" },
  { src: "/video/tesis/dikim.mp4", poster: "/tesis/dikim-2.webp" },
  { src: "/video/tesis/paketleme.mp4", poster: "/tesis/paketleme.webp" },
  { src: "/video/tesis/depo.mp4", poster: "/tesis/depo-sayim.webp" },
];

// Koleksiyon kutularının sırası; anahtar içerik dosyalarındaki "icon" alanıdır (5 dilde ortak)
const COLLECTION_ORDER = ["shorts", "tank", "leggings", "bra", "corset"];

const H2 = "font-heading text-3xl font-extrabold tracking-tight sm:text-4xl";
const KICKER = "font-heading text-xs font-bold uppercase tracking-[0.2em]";
const LINK =
  "inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wide underline underline-offset-4";

// Ürünler her istekte Supabase'den okunur: panelden yapılan değişiklik anında yansır
export const dynamic = "force-dynamic";

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
  const facility = getContent(locale).facility;
  const tc = await getTranslations({ locale, namespace: "common" });
  const tcat = await getTranslations({ locale, namespace: "catalogues" });
  const tblog = await getTranslations({ locale, namespace: "homeBlog" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const latestPosts = getBlogPosts(locale).slice(0, 3);
  const [slideRows, images] = await Promise.all([getActiveHeroSlides(), getSiteImages()]);
  const heroSlides: HeroSlide[] = slideRows.length
    ? slideRows.map((s) => ({
        title: localized(s.title, locale),
        subtitle: localized(s.subtitle, locale),
        images: s.images,
      }))
    : buildHeroSlides(c);

  type Collection = { icon: string; title: string; description: string };
  const collections = COLLECTION_ORDER.flatMap((icon) => {
    const col = (c.collections as Collection[]).find((x) => x.icon === icon);
    return col ? [{ ...col, image: images[`home.collection.${icon}` as SiteImageKey] }] : [];
  });
  const marquee = [...c.processList, ...c.yarnFeatures] as string[];

  return (
    <>
      {/* Hero */}
      <HeroSlider
        slides={heroSlides}
        allProductsLabel={tc("allProducts")}
        facilityLabel={tn("facility")}
        poster={images["home.heroPoster"]}
      />

      {/* Kayan şerit: süreçler ve kumaş özellikleri */}
      <div className="overflow-hidden border-b border-black/5 bg-white py-4" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center">
              {marquee.map((item) => (
                <span
                  key={`${n}-${item}`}
                  className="flex items-center gap-8 pe-8 font-heading text-sm font-semibold uppercase tracking-[0.18em] text-brand-navy/70"
                >
                  {item}
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-navy/30" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hakkımızda + rakamlar */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <span className={`${KICKER} text-brand-grey`}>{c.aboutBadge}</span>
            <h2 className={`${H2} mt-4 text-brand-navy`}>{c.aboutTitle}</h2>
            <p className="mt-6 text-lg leading-relaxed text-brand-grey">{c.aboutText}</p>
            <Link href="/hakkimizda" className={`${LINK} mt-8 text-brand-navy`}>
              {tc("learnMore")} →
            </Link>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={images["home.facility"]}
                alt={tc("company")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="slow-zoom object-cover"
              />
            </div>
          </Reveal>
        </div>
        <Reveal className="mt-16 grid grid-cols-3 gap-6 border-t border-black/10 pt-12">
          {process.stats.map((s: { value: number; suffix?: string; label: string }) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </Reveal>
      </section>

      {/* Koleksiyonlar: ürün fotoğraflı kutular */}
      <section className="bg-brand-grey-light py-24">
        <div className="mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-10">
          <Reveal className="flex items-end justify-between gap-4">
            <h2 className={`${H2} text-brand-navy`}>{c.collectionsTitle}</h2>
            <Link href="/katalog" className={`${LINK} hidden text-brand-navy sm:inline-flex`}>
              {tc("allProducts")} →
            </Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {collections.map((col, i) => (
              <Reveal
                key={col.icon}
                delay={i * 90}
                className={i === 0 ? "col-span-2 lg:col-span-1" : ""}
              >
                <Link
                  href="/katalog"
                  className={`group relative block overflow-hidden rounded-2xl bg-brand-navy ${
                    i === 0 ? "aspect-[16/11] lg:aspect-[3/5]" : "aspect-[3/5]"
                  }`}
                >
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    sizes="(min-width: 1024px) 20vw, 50vw"
                    className="object-cover object-top transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                    <h3 className="font-heading text-lg font-bold leading-snug sm:text-xl">
                      {col.title}
                    </h3>
                    <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
                      {col.description}
                    </p>
                    <span className="mt-3 inline-block font-heading text-xs font-semibold uppercase tracking-wide text-white/90">
                      {tc("viewCollection")} →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tesisimiz: fabrikadan hareketli görüntüler */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <span className={`${KICKER} text-brand-grey`}>{tn("facility")}</span>
            <h2 className={`${H2} mt-4 text-brand-navy`}>{c.facilityTitle}</h2>
            <p className="mt-6 max-w-md leading-relaxed text-brand-grey">{c.facilityText}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/tesisimiz"
                className="rounded-full bg-brand-navy px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black"
              >
                {tn("facility")}
              </Link>
              <Link
                href="/sureclerimiz"
                className="rounded-full border border-brand-navy/30 px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy transition hover:border-brand-navy"
              >
                {c.processTitle}
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {FACILITY_CLIPS.map((clip, i) => (
              <Reveal key={clip.src} delay={i * 100} className={i % 2 === 1 ? "mt-8" : ""}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-grey-light shadow-lg">
                  <AutoVideo
                    src={clip.src}
                    poster={clip.poster}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* İplikler ve teknoloji */}
      <section className="bg-brand-navy py-24 text-white">
        <Reveal className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className={H2}>{c.yarnTitle}</h2>
        </Reveal>
        <Reveal
          delay={120}
          className="mx-auto mt-10 grid max-w-5xl gap-x-10 gap-y-6 rounded-3xl bg-white px-6 py-10 sm:grid-cols-2 sm:px-10"
        >
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
        </Reveal>
      </section>

      {/* Değerler */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal>
          <span className={`${KICKER} text-brand-grey`}>{c.valuesBadge}</span>
          <p className="mt-4 max-w-2xl text-lg text-brand-grey">{c.valuesText}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {c.values.map((v: { title: string; text: string }, i: number) => (
            <Reveal key={v.title} delay={i * 90}>
              <div className="h-full rounded-2xl border border-black/5 p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <span className="font-heading text-3xl font-extrabold text-brand-navy/15">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-heading text-base font-bold text-brand-navy">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-grey">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Büyüme / vizyon */}
      <section className="relative overflow-hidden bg-brand-navy py-28 text-white">
        <Image
          src={images["home.growth"]}
          alt=""
          fill
          className="slow-zoom object-cover opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/30" />
        <Reveal className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className={`${KICKER} text-white/60`}>{c.growthBadge}</span>
            <h2 className={`${H2} mt-4`}>{c.growthTitle}</h2>
            <p className="mt-6 leading-relaxed text-white/75">{about.visionText}</p>
            <Link
              href="/hakkimizda"
              className="mt-8 inline-block rounded-full border border-white/30 px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white"
            >
              {c.growthLinkLabel}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Ürün katalogları */}
      <section className="bg-brand-grey-light py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className={`${H2} text-brand-navy`}>{tcat("title")}</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {c.catalogues.map((name: string, i: number) => (
              <Reveal key={name} delay={i * 90}>
                <div className="h-full rounded-2xl bg-brand-navy p-6 text-white">
                  <h3 className="font-heading text-base font-bold">{name}</h3>
                  <CatalogueDownloadForm
                    catalogueName={name}
                    placeholder={tcat("emailPlaceholder")}
                    buttonLabel={tcat("download")}
                    successMessage={tcat("success")}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Renkler */}
      <section className="relative overflow-hidden bg-brand-navy py-24 text-white">
        <Image src={images["home.color"]} alt="" fill className="object-cover opacity-20" />
        <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className={H2}>{c.colorTitle}</h2>
          <p className="mt-4 text-white/70">{c.colorText}</p>
        </Reveal>
      </section>

      {/* Blog */}
      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal className="flex items-end justify-between gap-4">
            <h2 className={`${H2} text-brand-navy`}>{tblog("title")}</h2>
            <Link href="/blog" className={`${LINK} hidden text-brand-navy sm:inline-flex`}>
              {tblog("viewAll")} →
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {latestPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 90}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full overflow-hidden rounded-2xl bg-brand-grey-light"
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
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Bülten */}
      <section className="bg-brand-grey-light py-20">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
            {c.newsletterTitle}
          </h2>
          <p className="mt-4 max-w-xl text-brand-grey">{c.newsletterText}</p>
          <NewsletterForm
            placeholder={c.newsletterPlaceholder}
            buttonLabel={c.newsletterButton}
            successMessage={c.newsletterSuccess}
          />
        </Reveal>
      </section>

      {/* İletişim çağrısı */}
      <section className="bg-brand-navy py-20 text-white">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <h2 className={H2}>{facility.ctaTitle}</h2>
            <p className="mt-4 text-white/70">{facility.ctaText}</p>
          </div>
          <Link
            href="/iletisim"
            className="shrink-0 rounded-full bg-white px-8 py-4 font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-white/90"
          >
            {tn("contact")}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
