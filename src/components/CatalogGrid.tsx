"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Product } from "@/lib/data";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 12;

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
    result.push(sorted[i]);
  }
  return result;
}

export default function CatalogGrid({
  products,
  categoryKeys,
  categoryLabels,
  allLabel,
}: {
  products: Product[];
  categoryKeys: string[];
  categoryLabels: Record<string, string>;
  allLabel: string;
}) {
  const t = useTranslations("catalog");
  const [active, setActive] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      active ? products.filter((p) => p.categoryKeys.includes(active)) : products,
    [products, active]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function selectCategory(key: string | null) {
    setActive(key);
    setPage(1);
  }

  function goToPage(next: number) {
    setPage(Math.min(Math.max(1, next), totalPages));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <div ref={topRef} className="flex flex-wrap gap-2 scroll-mt-28">
        <button
          type="button"
          onClick={() => selectCategory(null)}
          className={`rounded-full px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide transition ${
            active === null
              ? "bg-brand-navy text-white"
              : "bg-brand-grey-light text-brand-navy hover:bg-brand-navy/10"
          }`}
        >
          {allLabel}
        </button>
        {categoryKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => selectCategory(key)}
            className={`rounded-full px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide transition ${
              active === key
                ? "bg-brand-navy text-white"
                : "bg-brand-grey-light text-brand-navy hover:bg-brand-navy/10"
            }`}
          >
            {categoryLabels[key] ?? key}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 border-b border-black/5 pb-4 text-sm text-brand-grey">
        <span>
          <span className="font-semibold text-brand-navy">{filtered.length}</span> {t("productsCount")}
        </span>
        {totalPages > 1 && (
          <span className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              aria-label={t("previous")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-grey-light text-brand-navy transition hover:bg-brand-navy/10 disabled:opacity-30"
            >
              ‹
            </button>
            <span className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-navy">
              {t("page", { current: safePage, total: totalPages })}
            </span>
            <button
              type="button"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              aria-label={t("next")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-grey-light text-brand-navy transition hover:bg-brand-navy/10 disabled:opacity-30"
            >
              ›
            </button>
          </span>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {paginated.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-14 flex flex-wrap items-center justify-center gap-2 border-t border-black/5 pt-10">
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            className="rounded-full border border-brand-navy/20 px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-brand-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-navy"
          >
            {t("previous")}
          </button>

          {getPageNumbers(safePage, totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-sm text-brand-grey">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                aria-current={p === safePage ? "page" : undefined}
                className={`flex h-11 w-11 items-center justify-center rounded-full font-heading text-sm font-semibold transition ${
                  p === safePage
                    ? "bg-brand-navy text-white"
                    : "bg-brand-grey-light text-brand-navy hover:bg-brand-navy/10"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            className="rounded-full border border-brand-navy/20 px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-brand-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-navy"
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
}
