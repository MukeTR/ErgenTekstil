"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/data";
import ProductCard from "./ProductCard";

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
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      active ? products.filter((p) => p.categoryKeys.includes(active)) : products,
    [products, active]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive(null)}
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
            onClick={() => setActive(key)}
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
        {filtered.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
