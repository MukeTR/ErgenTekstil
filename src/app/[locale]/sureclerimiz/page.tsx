import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/lib/data";
import PageHero from "@/components/PageHero";
import StatCounter from "@/components/StatCounter";

export default async function ProcessPage(props: PageProps<"/[locale]/sureclerimiz">) {
  const { locale } = (await props.params) as { locale: Locale };
  setRequestLocale(locale);
  const c = getContent(locale).process;

  return (
    <>
      <PageHero title={c.title} subtitle={c.intro} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((s: { title: string; text: string; image: string | null }) => (
            <div key={s.title}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-grey-light">
                {s.image && (
                  <Image
                    src={`/sureclerimiz/${s.image}`}
                    alt={s.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <h2 className="mt-5 font-heading text-lg font-bold uppercase text-brand-grey">
                {s.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-grey">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-14 rounded-2xl bg-brand-grey-light p-6 leading-relaxed text-brand-grey">
          {c.outro}
        </p>
      </section>

      <section className="bg-brand-navy py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
            {c.statsTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">{c.statsText}</p>
          <div className="mt-10 grid grid-cols-3 gap-6 rounded-2xl bg-white p-8">
            {c.stats.map((s: { value: number; label: string }) => (
              <StatCounter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
