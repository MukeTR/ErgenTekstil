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

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {paginated.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            className="rounded-full px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-brand-navy/10 disabled:cursor-not-allowed disabled:opacity-30"
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
                className={`flex h-9 w-9 items-center justify-center rounded-full font-heading text-xs font-semibold transition ${
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
            className="rounded-full px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-brand-navy/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
}
