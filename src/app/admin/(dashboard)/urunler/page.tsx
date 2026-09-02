import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { ProductRow } from "@/lib/supabase/types";
import { productImageUrl } from "@/lib/data";
import ProductRowActions from "./ProductRowActions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  const products = (data ?? []) as ProductRow[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Ürünler</h1>
        <Link
          href="/admin/urunler/yeni"
          className="rounded-full bg-brand-navy px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-white hover:bg-black"
        >
          + Yeni Ürün
        </Link>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error.message}</p>}

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-brand-grey">
            <tr>
              <th className="px-4 py-3">Görsel</th>
              <th className="px-4 py-3">İsim (TR)</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  {p.images[0] ? (
                    <div className="relative h-14 w-11 overflow-hidden rounded-lg bg-brand-grey-light">
                      <Image
                        src={productImageUrl(p.images[0])}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-11 rounded-lg bg-brand-grey-light" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{p.name.tr}</td>
                <td className="px-4 py-3 text-brand-grey">
                  {p.category_keys.join(", ")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      p.active
                        ? "bg-green-100 text-green-800"
                        : "bg-brand-grey-light text-brand-grey"
                    }`}
                  >
                    {p.active ? "Yayında" : "Gizli"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ProductRowActions id={p.id} active={p.active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-sm text-brand-grey">
            Henüz ürün eklenmemiş.
          </p>
        )}
      </div>
    </div>
  );
}
