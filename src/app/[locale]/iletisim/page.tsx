import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/lib/data";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";

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

            <div className="mt-10">
              <h2 className="font-heading text-lg font-bold text-brand-navy">{c.branchTitle}</h2>
              <p className="mt-2 text-brand-grey">{c.branchAddress}</p>
              <a
                href={`tel:${c.branchPhone.replace(/[^\d+]/g, "")}`}
                className="ltr-only mt-1 block text-brand-grey hover:text-brand-navy"
              >
                {c.branchPhone}
              </a>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl">
              <iframe
                title="map"
                className="h-72 w-full border-0"
                loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  c.headOfficeAddress
                )}&output=embed`}
              />
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
