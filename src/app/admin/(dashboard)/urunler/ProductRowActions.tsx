"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteProduct, toggleProductActive } from "../actions";

export default function ProductRowActions({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex justify-end gap-3 text-xs font-semibold uppercase tracking-wide">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleProductActive(id, !active))}
        className="text-brand-navy underline disabled:opacity-50"
      >
        {active ? "Gizle" : "Yayınla"}
      </button>
      <Link href={`/admin/urunler/${id}`} className="text-brand-navy underline">
        Düzenle
      </Link>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
            startTransition(() => deleteProduct(id));
          }
        }}
        className="text-red-600 underline disabled:opacity-50"
      >
        Sil
      </button>
    </div>
  );
}
