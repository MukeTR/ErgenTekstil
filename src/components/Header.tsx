import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import MobileNav from "./MobileNav";
import LanguageSwitcher from "./LanguageSwitcher";

export default async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const links = [
    { href: "/", label: t("home") },
    { href: "/hakkimizda", label: t("about") },
    { href: "/sureclerimiz", label: t("process") },
    { href: "/katalog", label: t("catalog") },
    { href: "/blog", label: t("blog") },
    { href: "/iletisim", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/marka/ergen-tekstil-logo.svg"
            alt={tc("company")}
            width={36}
            height={43}
            className="h-9 w-auto"
            priority
          />
          <span className="font-heading text-sm font-bold tracking-wide text-brand-navy sm:text-base">
            ERGEN TEKSTİL
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-heading text-[13px] font-semibold uppercase tracking-wide text-brand-navy/80 transition hover:text-brand-navy"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher locale={locale} />
          <Link
            href="/iletisim"
            className="rounded-full bg-brand-navy px-5 py-2.5 font-heading text-[13px] font-semibold uppercase tracking-wide text-white transition hover:bg-black"
          >
            {tc("requestQuote")}
          </Link>
        </div>

        <MobileNav links={links} locale={locale} ctaLabel={tc("requestQuote")} />
      </div>
    </header>
  );
}
