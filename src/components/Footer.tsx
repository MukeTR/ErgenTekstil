import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/lib/data";
import { LEGGINGS_LANDING } from "@/data/landing-leggings";
import { SOCIAL_LINKS, type SocialKey } from "@/lib/social";

const SOCIAL_ICONS: Record<SocialKey, React.ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.25H3V9.75Zm6.5 0h3.83v1.54h.05c.53-1 1.84-1.79 3.78-1.79 4.04 0 4.84 2.42 4.84 5.86V21h-4v-4.98c0-1.3-.03-2.97-1.86-2.97-1.86 0-2.14 1.4-2.14 2.87V21h-4V9.75Z" />
    </svg>
  ),
};

const LEGAL_LABELS: Record<Locale, { privacy: string; cookies: string; terms: string }> = {
  tr: { privacy: "Gizlilik Politikası", cookies: "Çerez Politikası", terms: "Kullanım Koşulları" },
  en: { privacy: "Privacy Policy", cookies: "Cookie Policy", terms: "Terms of Use" },
  ar: { privacy: "سياسة الخصوصية", cookies: "سياسة ملفات الارتباط", terms: "شروط الاستخدام" },
  de: { privacy: "Datenschutzerklärung", cookies: "Cookie-Richtlinie", terms: "Nutzungsbedingungen" },
  ru: { privacy: "Политика конфиденциальности", cookies: "Политика cookie", terms: "Условия использования" },
};

export default async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tf = await getTranslations({ locale, namespace: "footer" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const content = getContent(locale);
  const year = new Date().getFullYear();

  const links = [
    { href: "/", label: t("home") },
    { href: "/hakkimizda", label: t("about") },
    { href: "/tesisimiz", label: t("facility") },
    { href: "/sureclerimiz", label: t("process") },
    { href: "/katalog", label: t("catalog") },
    { href: "/seamless-tayt-ureticisi", label: LEGGINGS_LANDING[locale].navLabel },
    { href: "/blog", label: t("blog") },
    { href: "/iletisim", label: t("contact") },
  ];

  return (
    <footer className="bg-brand-navy text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/marka/logo-beyaz.webp"
              alt={tc("company")}
              width={140}
              height={40}
              className="mb-4 h-9 w-auto"
            />
            <p className="text-sm leading-relaxed text-white/60">
              {content.about.intro}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-white">
              {content.footer.productsTitle}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-white">
              {content.footer.aboutLinks[0]}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              {content.footer.aboutLinks.slice(1).map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-white">
              {content.footer.contactTitle}
            </h3>
            <p className="mt-4 text-sm text-white/60">{content.footer.address}</p>
            <div className="mt-3 space-y-1 text-sm">
              {content.contact.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="ltr-only block text-white/60 transition hover:text-white"
                >
                  {phone}
                </a>
              ))}
            </div>
            <a
              href={`mailto:${content.contact.email}`}
              className="mt-2 block text-sm text-white/60 transition hover:text-white"
            >
              {content.contact.email}
            </a>
            <div className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white hover:text-white"
                >
                  {SOCIAL_ICONS[s.key]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>
            Copyright © {year} {content.footer.copyright}. {tf("rights")}
          </p>
          <div className="flex gap-5">
            <Link href="/gizlilik-politikasi" className="hover:text-white">
              {LEGAL_LABELS[locale].privacy}
            </Link>
            <Link href="/cerez-politikasi" className="hover:text-white">
              {LEGAL_LABELS[locale].cookies}
            </Link>
            <Link href="/kullanim-kosullari" className="hover:text-white">
              {LEGAL_LABELS[locale].terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
