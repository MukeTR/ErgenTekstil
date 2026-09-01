import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/lib/data";

export default async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tf = await getTranslations({ locale, namespace: "footer" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const content = getContent(locale);
  const year = new Date().getFullYear();

  const links = [
    { href: "/", label: t("home") },
    { href: "/hakkimizda", label: t("about") },
    { href: "/sureclerimiz", label: t("process") },
    { href: "/katalog", label: t("catalog") },
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
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>
            Copyright © {year} {content.footer.copyright}. {tf("rights")}
          </p>
          <div className="flex gap-5">
            <Link href="/gizlilik-politikasi" className="hover:text-white">
              {locale === "tr" ? "Gizlilik Politikası" : locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <Link href="/cerez-politikasi" className="hover:text-white">
              {locale === "tr" ? "Çerez Politikası" : locale === "ar" ? "سياسة ملفات الارتباط" : "Cookie Policy"}
            </Link>
            <Link href="/kullanim-kosullari" className="hover:text-white">
              {locale === "tr" ? "Kullanım Koşulları" : locale === "ar" ? "شروط الاستخدام" : "Terms of Use"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
