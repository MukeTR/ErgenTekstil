import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/lib/data";
import PageHero from "@/components/PageHero";

export default async function AboutPage(props: PageProps<"/[locale]/hakkimizda">) {
  const { locale } = (await props.params) as { locale: Locale };
  setRequestLocale(locale);
  const c = getContent(locale).about;

  return (
    <>
      <PageHero title={c.title} subtitle={c.badge} />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-lg leading-relaxed text-brand-grey">{c.intro}</p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="font-heading text-xl font-bold text-brand-navy">{c.missionTitle}</h2>
            <p className="mt-4 leading-relaxed text-brand-grey">{c.missionText}</p>
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-brand-navy">{c.visionTitle}</h2>
            <p className="mt-4 leading-relaxed text-brand-grey">{c.visionText}</p>
          </div>
        </div>

        <div className="mt-14 rounded-3xl bg-brand-grey-light p-8 sm:p-10">
          <h2 className="font-heading text-xl font-bold text-brand-navy">
            {c.principlesTitle}
          </h2>
          <ul className="mt-6 space-y-3">
            {c.principles.map((p: string) => (
              <li key={p} className="flex gap-3 text-brand-grey">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
