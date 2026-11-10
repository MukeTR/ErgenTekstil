import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import MobileNav from "./MobileNav";
import LanguageSwitcher from "./LanguageSwitcher";
import { QuoteListHeaderButton } from "./quote/QuoteListButton";

export default async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const tq = await getTranslations({ locale, namespace: "quoteList" });

  const links = [
    { href: "/", label: t("home") },
    { href: "/hakkimizda", label: t("about") },
    { href: "/sureclerimiz", label: t("process") },
    { href: "/katalog", label: t("catalog") },
    { href: "/blog", label: t("blog") },
    { href: "/iletisim", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-brand-ink bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
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

        <nav className="hidden items-center gap-5 xl:flex 2xl:gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap font-heading text-[12px] font-bold uppercase tracking-wide text-brand-navy/80 underline decoration-brand-volt decoration-[3px] underline-offset-8 decoration-transparent transition hover:text-brand-navy hover:decoration-brand-volt 2xl:text-[13px]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <QuoteListHeaderButton />
          <LanguageSwitcher locale={locale} />
          <Link
            href="/iletisim"
            className="btn-sport whitespace-nowrap bg-brand-ink px-6 py-2.5 font-heading text-[12px] font-bold uppercase tracking-wide text-white transition hover:bg-brand-volt hover:text-brand-ink"
          >
            {tc("requestQuote")}
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <QuoteListHeaderButton hideWhenEmpty />
          <MobileNav
            links={links}
            locale={locale}
            ctaLabel={tc("requestQuote")}
            menuLabel={t("menu")}
            closeLabel={t("close")}
            quoteListLabel={tq("title")}
            cardTitle={t("menuCardTitle")}
            cardText={t("menuCardText")}
          />
        </div>
      </div>
    </header>
  );
}
