import legal from "@/data/legal.tr.json";
import type { Locale } from "@/i18n/routing";
import PageHero from "@/components/PageHero";

type LegalSlug = keyof typeof legal;

const NOTICE: Record<Exclude<Locale, "tr">, string> = {
  en: "This policy is governed by Turkish data protection law (KVKK) and is provided in Turkish, its original legal language.",
  ar: "تخضع هذه السياسة لقانون حماية البيانات الشخصية التركي (KVKK) وتُقدَّم باللغة التركية، وهي لغتها القانونية الأصلية.",
  de: "Diese Richtlinie unterliegt dem türkischen Datenschutzrecht (KVKK) und wird in ihrer rechtsverbindlichen Originalsprache Türkisch bereitgestellt.",
  ru: "Настоящая политика регулируется турецким законом о защите персональных данных (KVKK) и предоставляется на турецком языке — её оригинальном юридическом языке.",
};

export default function LegalPage({ slug, locale }: { slug: LegalSlug; locale: Locale }) {
  const page = legal[slug];

  return (
    <>
      <PageHero title={page.title ?? ""} />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {locale !== "tr" && (
          <p className="mb-8 rounded-xl bg-brand-grey-light p-4 text-sm text-brand-grey">
            {NOTICE[locale]}
          </p>
        )}
        <div dir="ltr" className="space-y-4 text-left">
          {page.blocks.map((b, i) =>
            b.tag === "li" ? (
              <p key={i} className="flex gap-3 pl-2 text-brand-grey">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy" />
                <span>{b.text}</span>
              </p>
            ) : b.tag === "h2" || b.tag === "h3" ? (
              <h2 key={i} className="pt-4 font-heading text-lg font-bold text-brand-navy">
                {b.text}
              </h2>
            ) : (
              <p key={i} className="leading-relaxed text-brand-grey">
                {b.text}
              </p>
            )
          )}
        </div>
      </section>
    </>
  );
}
