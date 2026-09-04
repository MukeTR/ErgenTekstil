"use client";

import { useTranslations } from "next-intl";
import { useQuoteList } from "./QuoteListProvider";

/** Header'daki liste ikonu (rozetli). */
export function QuoteListHeaderButton() {
  const t = useTranslations("quoteList");
  const { items, toggle, hydrated } = useQuoteList();
  const count = hydrated ? items.length : 0;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("title")}
      title={t("title")}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-brand-navy transition hover:border-brand-navy/40"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6h11M9 12h11M9 18h11" />
        <path d="M4 6h.01M4 12h.01M4 18h.01" strokeWidth="2.6" />
      </svg>
      {count > 0 && (
        <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-navy px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

/** Sol altta yüzen "Teklif Listesi (n)" butonu — listede ürün varken görünür. */
export function QuoteListFloatingButton() {
  const t = useTranslations("quoteList");
  const { items, open, hydrated, isOpen } = useQuoteList();
  if (!hydrated || items.length === 0 || isOpen) return null;
  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  return (
    <button
      type="button"
      onClick={open}
      className="fixed bottom-6 start-6 z-50 flex items-center gap-3 rounded-full bg-brand-navy py-3 pe-5 ps-4 text-white shadow-xl transition hover:bg-black"
    >
      <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-1.5 font-heading text-xs font-bold text-brand-navy">
        {items.length}
      </span>
      <span className="text-start leading-tight">
        <span className="block font-heading text-xs font-semibold uppercase tracking-wide">
          {t("title")}
        </span>
        <span className="block text-[11px] text-white/70">
          {totalQty} {t("pcs")} · {t("requestNow")}
        </span>
      </span>
    </button>
  );
}
