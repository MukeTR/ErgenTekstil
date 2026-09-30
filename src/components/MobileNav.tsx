"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";
import { useQuoteList } from "./quote/QuoteListProvider";

export default function MobileNav({
  links,
  locale,
  ctaLabel,
  menuLabel,
  closeLabel,
  quoteListLabel,
  cardTitle,
  cardText,
  cardImage,
}: {
  links: { href: string; label: string }[];
  locale: Locale;
  ctaLabel: string;
  menuLabel: string;
  closeLabel: string;
  quoteListLabel: string;
  cardTitle: string;
  cardText: string;
  cardImage: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items, open: openQuoteList, hydrated } = useQuoteList();
  const count = hydrated ? items.length : 0;

  useEffect(() => setMounted(true), []);

  // Menü açıkken sayfa kaymasın, Esc kapatsın
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  // Header'daki backdrop-blur, içindeki fixed öğeleri header kutusuna hapseder;
  // bu yüzden panel body'ye portal ile basılır.
  const panel = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={menuLabel}
      className="fixed inset-0 z-[65] flex flex-col bg-white xl:hidden"
    >
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
        <Link href="/" onClick={close} className="flex items-center gap-3">
          <Image
            src="/marka/ergen-tekstil-logo.svg"
            alt=""
            width={36}
            height={43}
            className="h-9 w-auto"
          />
          <span className="font-heading text-sm font-bold tracking-wide text-brand-navy">
            ERGEN TEKSTİL
          </span>
        </Link>
        <button
          type="button"
          onClick={close}
          aria-label={closeLabel}
          className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-brand-navy hover:bg-brand-grey-light"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-10 pt-4">
        <nav className="flex flex-col">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              className="border-b border-black/5 py-4 font-heading text-base font-semibold text-brand-navy"
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              close();
              openQuoteList();
            }}
            className="flex items-center justify-between border-b border-black/5 py-4 text-start font-heading text-base font-semibold text-brand-navy"
          >
            <span className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6h11M9 12h11M9 18h11" />
                <path d="M4 6h.01M4 12h.01M4 18h.01" strokeWidth="2.6" />
              </svg>
              {quoteListLabel}
            </span>
            {count > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-navy px-2 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </nav>

        <div className="mt-6">
          <LanguageSwitcher locale={locale} variant="mobile" />
        </div>

        {/* Yönlendirici kart: gerçek fuar standı fotoğrafı + teklif çağrısı */}
        <Link
          href="/iletisim"
          onClick={close}
          className="relative mt-8 block overflow-hidden rounded-2xl bg-brand-navy text-white"
        >
          <Image
            src={cardImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-transparent" />
          <div className="relative flex min-h-56 flex-col justify-end p-6">
            <p className="font-heading text-lg font-extrabold">{cardTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{cardText}</p>
            <span className="mt-5 inline-flex w-fit rounded-full bg-white px-5 py-2.5 font-heading text-[13px] font-semibold uppercase tracking-wide text-brand-navy">
              {ctaLabel}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={menuLabel}
        aria-expanded={open}
        className="flex h-10 items-center gap-2 rounded-full border border-black/10 ps-3 pe-2.5 text-brand-navy"
      >
        <span className="font-heading text-[11px] font-bold uppercase tracking-wide">{menuLabel}</span>
        <span className="flex w-5 flex-col gap-1" aria-hidden="true">
          <span className="h-0.5 w-5 bg-brand-navy" />
          <span className="h-0.5 w-5 bg-brand-navy" />
          <span className="h-0.5 w-5 bg-brand-navy" />
        </span>
      </button>

      {open && mounted && createPortal(panel, document.body)}
    </div>
  );
}
