import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { FACTORY_MAP_EMBED } from "@/lib/location";
import { getContent } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";
import { getSiteImages, type SiteImageKey } from "@/lib/site-media";
import StatCounter from "@/components/StatCounter";
import Reveal from "@/components/Reveal";
import AutoVideo from "@/components/AutoVideo";

// Fabrikamızdan kısa, sessiz döngüler (Ekim 2026 çekimi)
const CLIPS = [
  { src: "/video/tesis/dis-cephe.mp4", poster: "/tesis/dis-cephe.webp" },
  { src: "/video/tesis/orme.mp4", poster: "/tesis/orme-salonu.webp" },
  { src: "/video/tesis/dikim.mp4", poster: "/tesis/dikim-2.webp" },
  { src: "/video/tesis/depo-donus.mp4", poster: "/tesis/depo.webp" },
];

const H2 = "font-heading text-3xl font-extrabold tracking-tight sm:text-4xl";
const KICKER = "font-heading text-xs font-bold uppercase tracking-[0.2em]";

export async function generateMetadata(
  props: PageProps<"/[locale]/tesisimiz">
): Promise<Metadata> {
  const { locale } = (await props.params) as { locale: Locale };
  const c = getContent(locale).facility;
  return {
    title: c.title,
    description: c.subtitle,
    alternates: { canonical: `${SITE_URL}/${locale}/tesisimiz/` },
  };
}

export default async function FacilityPage(props: PageProps<"/[locale]/tesisimiz">) {
  const { locale } = (await props.params) as { locale: Locale };
  setRequestLocale(locale);

  const content = getContent(locale);
  const c = content.facility;
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const images = await getSiteImages();

  return (
    <>
      {/* Başlık: fabrikadan video döngüsü */}
      <section className="relative flex min-h-[72vh] items-end overflow-hidden bg-brand-navy text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={images["facility.hero"]}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="/video/tesis/hero-loop-mobil.mp4"
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source src="/video/tesis/hero-loop.webm" type="video/webm" />
          <source src="/video/tesis/hero-loop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-brand-navy/10" />
        <div className="hero-fade relative mx-auto w-full max-w-7xl px-4 pb-16 pt-40 sm:px-6 sm:pb-20 lg:px-8">
          <span className={`${KICKER} text-white/70`}>{c.introBadge}</span>
          <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight sm:text-6xl">
            {c.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{c.subtitle}</p>
        </div>
      </section>

      {/* Giriş */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className={`${H2} text-brand-navy`}>{c.introTitle}</h2>
            <p className="mt-6 text-lg leading-relaxed text-brand-grey">{c.introText}</p>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={images["facility.intro"]}
                alt={tc("company")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="slow-zoom object-cover"
              />
            </div>
          </Reveal>
        </div>
        <Reveal className="mt-16 grid grid-cols-3 gap-6 border-t border-black/10 pt-12">
          {content.process.stats.map((s: { value: number; suffix?: string; label: string }) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </Reveal>
      </section>

      {/* Fabrika filmi */}
      <section className="bg-brand-navy py-24 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className={H2}>{c.filmTitle}</h2>
            <p className="mt-4 max-w-2xl text-white/70">{c.filmText}</p>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <div className="overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-white/10">
              <video
                controls
                playsInline
                preload="none"
                poster={images["facility.film"]}
                className="aspect-video w-full"
              >
                <source src="/video/tesis/fabrika-filmi.mp4" type="video/mp4" />
              </video>
            </div>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {CLIPS.map((clip, i) => (
              <Reveal key={clip.src} delay={i * 90}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/5">
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

      {/* Bölümler */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className={`${H2} text-brand-navy`}>{c.departmentsTitle}</h2>
          <p className="mt-4 max-w-2xl text-lg text-brand-grey">{c.departmentsText}</p>
        </Reveal>
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {c.departments.map((d: { title: string; text: string }, i: number) => (
            <Reveal key={d.title} delay={(i % 4) * 90}>
              <div className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-grey-light">
                  <Image
                    src={images[`facility.dept-${i + 1}` as SiteImageKey]}
                    alt={d.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute start-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 font-heading text-xs font-bold text-brand-navy">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold text-brand-navy">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-grey">{d.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Depo ve sevkiyat: tek görsel, depoda sayım yapan ekibimizin videosu */}
      <section className="bg-brand-grey-light py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:px-8">
          <Reveal>
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-xl">
              <AutoVideo
                src="/video/tesis/depo.mp4"
                poster={images["facility.warehouse"]}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <h2 className={`${H2} text-brand-navy`}>{c.warehouseTitle}</h2>
            <p className="mt-6 text-lg leading-relaxed text-brand-grey">{c.warehouseText}</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {["/tesis/sevkiyat.webp", "/tesis/depo.webp"].map((src) => (
                <div key={src} className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={src}
                    alt={c.warehouseTitle}
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Konum */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className={`${H2} text-brand-navy`}>{c.locationTitle}</h2>
            <p className="mt-6 text-lg leading-relaxed text-brand-grey">{c.locationText}</p>
            <p className="mt-4 font-heading text-sm font-semibold text-brand-navy">
              {content.contact.headOfficeAddress}
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="overflow-hidden rounded-3xl shadow-lg">
              <iframe
                title="map"
                className="h-80 w-full border-0"
                loading="lazy"
                src={FACTORY_MAP_EMBED}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* İletişim çağrısı */}
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
            {tn("contact")}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
