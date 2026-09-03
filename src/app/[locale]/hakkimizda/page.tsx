import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/lib/data";
import PageHero from "@/components/PageHero";
import StatCounter from "@/components/StatCounter";

export default async function AboutPage(props: PageProps<"/[locale]/hakkimizda">) {
  const { locale } = (await props.params) as { locale: Locale };
  setRequestLocale(locale);
  const c = getContent(locale).about;
  const process = getContent(locale).process;
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <PageHero title={c.title} subtitle={c.badge} />

      {/* Giriş + fotoğraf */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-lg leading-relaxed text-brand-grey sm:text-xl">{c.intro}</p>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-black/5 pt-8">
              {process.stats.map((s: { value: number; suffix: string; label: string }) => (
                <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/sureclerimiz/step-2-orme-teknolojisi.webp"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Misyon / Vizyon kartları */}
      <section className="bg-brand-grey-light py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative aspect-[16/9]">
              <Image
                src="/sureclerimiz/step-4-orme-islemi.webp"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-8 sm:p-10">
              <h2 className="font-heading text-2xl font-extrabold text-brand-navy">
                {c.missionTitle}
              </h2>
              <p className="mt-4 leading-relaxed text-brand-grey">{c.missionText}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative aspect-[16/9]">
              <Image
                src="/images/factory-floor.webp"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-8 sm:p-10">
              <h2 className="font-heading text-2xl font-extrabold text-brand-navy">
                {c.visionTitle}
              </h2>
              <p className="mt-4 leading-relaxed text-brand-grey">{c.visionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prensipler */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
          {c.principlesTitle}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.principles.map((p: string, i: number) => (
            <div key={p} className="rounded-2xl border border-black/5 p-6">
              <span className="font-heading text-3xl font-extrabold text-brand-navy/15">
                0{i + 1}
              </span>
              <p className="mt-3 leading-relaxed text-brand-grey">{p}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/sureclerimiz"
            className="rounded-full bg-brand-navy px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black"
          >
            {tc("learnMore")}
          </Link>
          <Link
            href="/iletisim"
            className="rounded-full border border-brand-navy/30 px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy transition hover:border-brand-navy"
          >
            {tc("requestQuote")}
          </Link>
        </div>
      </section>
    </>
  );
}
