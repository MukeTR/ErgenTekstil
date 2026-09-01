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

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <ol className="space-y-10">
          {c.steps.map((s: { title: string; text: string }, i: number) => (
            <li key={s.title} className="flex gap-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-navy font-heading text-lg font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-navy">{s.title}</h2>
                <p className="mt-2 leading-relaxed text-brand-grey">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-12 rounded-2xl bg-brand-grey-light p-6 leading-relaxed text-brand-grey">
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
