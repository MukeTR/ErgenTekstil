import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/lib/data";
import PageHero from "@/components/PageHero";
import StatCounter from "@/components/StatCounter";
import Reveal from "@/components/Reveal";
import AboutStory, { type StoryChapter } from "@/components/AboutStory";
import { getSiteImages } from "@/lib/site-media";

export default async function AboutPage(props: PageProps<"/[locale]/hakkimizda">) {
  const { locale } = (await props.params) as { locale: Locale };
  setRequestLocale(locale);
  const content = getContent(locale);
  const c = content.about;
  const tn = await getTranslations({ locale, namespace: "nav" });
  const images = await getSiteImages();

  // Kaydırmalı hikâye (giriş yazısından sonra başlar). Metinlerin tamamı içerik dosyalarından gelir.
  const chapters: StoryChapter[] = [
    { mark: "01", title: c.missionTitle, text: c.missionText, image: images["about.mission"] },
    { mark: "02", title: c.visionTitle, text: c.visionText, image: images["about.vision"] },
    {
      mark: "03",
      title: content.home.facilityTitle,
      text: content.home.facilityText,
      image: images["about.facility"],
    },
    { mark: "04", title: c.principlesTitle, list: c.principles, image: images["about.principles"] },
  ];

  return (
    <>
      <PageHero title={c.title} subtitle={c.badge} image={images.pageHero} />

      {/* Önce yazı: kim olduğumuz */}
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8">
        <Reveal>
          <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-brand-navy/50">
            2004 · {c.badge}
          </span>
          <p className="mt-6 font-heading text-2xl font-bold leading-snug tracking-tight text-brand-navy sm:text-4xl sm:leading-tight">
            {c.intro}
          </p>
        </Reveal>
        <Reveal delay={150}>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-brand-grey">
            {content.home.aboutText}
          </p>
        </Reveal>
      </section>

      {/* Rakamlar */}
      <section className="border-y border-black/5 bg-brand-grey-light py-14">
        <Reveal className="mx-auto grid max-w-5xl grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
          {content.process.stats.map((s: { value: number; suffix?: string; label: string }) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </Reveal>
      </section>

      {/* Kaydırmalı hikâye */}
      <div className="py-10 lg:py-0">
        <AboutStory chapters={chapters} />
      </div>

      {/* Devam */}
      <section className="bg-brand-navy py-20 text-white">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
              {content.facility.ctaTitle}
            </h2>
            <p className="mt-4 text-white/70">{content.facility.ctaText}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4">
            <Link
              href="/tesisimiz"
              className="rounded-full bg-white px-8 py-4 font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-white/90"
            >
              {tn("facility")}
            </Link>
            <Link
              href="/iletisim"
              className="rounded-full border border-white/40 px-8 py-4 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white"
            >
              {tn("contact")}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
