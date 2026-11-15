import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  FACTORY_MAP_EMBED,
  FACTORY_MAP_LINK,
  STORE_MAP_EMBED,
  STORE_MAP_LINK,
} from "@/lib/location";
import { getContent } from "@/lib/data";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata(
  props: PageProps<"/[locale]/iletisim">
): Promise<Metadata> {
  const { locale } = (await props.params) as { locale: Locale };
  const c = getContent(locale).contact;
  return pageMetadata(locale, "/iletisim/", c.title, `Ergen Tekstil — ${c.headOfficeAddress}. ${c.phones[0]} · ${c.email}`);
}

export default async function ContactPage(props: PageProps<"/[locale]/iletisim">) {
  const { locale } = (await props.params) as { locale: Locale };
  const searchParams = (await props.searchParams) as { urun?: string };
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contactForm" });
  const c = getContent(locale).contact;

  return (
    <>
      <PageHero title={c.title} />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-lg font-bold text-brand-navy">
              {c.headOfficeTitle}
            </h2>
            <p className="mt-2 text-brand-grey">{c.headOfficeAddress}</p>
            <div className="mt-4 space-y-1 ltr-only text-brand-grey">
              {c.phones.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s+/g, "")}`} className="block hover:text-brand-navy">
                  {phone}
                </a>
              ))}
            </div>
            <a href={`mailto:${c.email}`} className="mt-1 block text-brand-grey hover:text-brand-navy">
              {c.email}
            </a>
            <LocationMap title={c.headOfficeTitle} embed={FACTORY_MAP_EMBED} link={FACTORY_MAP_LINK} label={t("directions")} />

            <div className="mt-10">
              <h2 className="font-heading text-lg font-bold text-brand-navy">{c.branchTitle}</h2>
              <p className="mt-2 text-brand-grey">{c.branchAddress}</p>
              <a
                href={`tel:${c.branchPhone.replace(/[^\d+]/g, "")}`}
                className="ltr-only mt-1 block text-brand-grey hover:text-brand-navy"
              >
                {c.branchPhone}
              </a>
              <LocationMap title={c.branchTitle} embed={STORE_MAP_EMBED} link={STORE_MAP_LINK} label={t("directions")} />
            </div>
          </div>

          <div>
            <h2 className="font-heading text-lg font-bold text-brand-navy">{c.formTitle}</h2>
            <div className="mt-6">
              <ContactForm
                fields={c.formFields}
                targetEmail={c.email}
                successMessage={t("success")}
                prefillProduct={searchParams.urun ?? ""}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** Adresin hemen altında duran harita + yol tarifi bağlantısı (fabrika ve mağaza için ayrı ayrı). */
function LocationMap({
  title,
  embed,
  link,
  label,
}: {
  title: string;
  embed: string;
  link: string;
  label: string;
}) {
  return (
    <div className="mt-5">
      <div className="overflow-hidden rounded-2xl">
        <iframe title={title} className="h-56 w-full border-0" loading="lazy" src={embed} />
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-wide text-brand-navy hover:underline"
      >
        {label}
        <span aria-hidden="true" className="rtl:-scale-x-100">→</span>
      </a>
    </div>
  );
}
