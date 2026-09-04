"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuoteList, type QuoteItem } from "./QuoteListProvider";

type Props = {
  product: Omit<QuoteItem, "qty">;
  /** "icon": kart üzerindeki küçük yuvarlak buton; "full": ürün sayfasındaki adetli büyük buton */
  variant?: "icon" | "full";
};

export default function AddToQuoteButton({ product, variant = "icon" }: Props) {
  const t = useTranslations("quoteList");
  const { add, has, open } = useQuoteList();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const inList = has(product.slug);

  function handleAdd(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    add(product, variant === "full" ? qty : 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
    if (variant === "full") open();
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleAdd}
        aria-label={inList ? t("inList") : t("add")}
        title={inList ? t("inList") : t("add")}
        className={`absolute end-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition ${
          inList
            ? "bg-brand-navy text-white"
            : "bg-white/95 text-brand-navy hover:bg-brand-navy hover:text-white"
        }`}
      >
        {justAdded || inList ? (
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
            <path d="M4 10.5 8 14.5 16 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
            <path d="M10 4v12M4 10h12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-full border border-brand-navy/20 bg-white">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="−"
          className="flex h-11 w-11 items-center justify-center text-lg text-brand-navy hover:bg-brand-grey-light rounded-s-full"
        >
          −
        </button>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          aria-label={t("qty")}
          className="w-16 border-x border-brand-navy/10 bg-transparent py-2.5 text-center font-heading text-sm font-semibold text-brand-navy outline-none"
        />
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          aria-label="+"
          className="flex h-11 w-11 items-center justify-center text-lg text-brand-navy hover:bg-brand-grey-light rounded-e-full"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="rounded-full bg-brand-navy px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black"
      >
        {justAdded ? t("added") : t("add")}
      </button>
    </div>
  );
}
