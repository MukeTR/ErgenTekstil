"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CATEGORY_KEYS, COLOR_KEYS } from "@/lib/catalog-taxonomy";
import { productImageUrl } from "@/lib/data";
import { saveProduct, uploadProductImage } from "../actions";

type ProductFormValues = {
  id?: string;
  slug: string;
  legacy_id?: string | null;
  name: { tr: string; en: string; ar: string };
  category_keys: string[];
  color_keys: string[];
  features: { tr: string[]; en: string[]; ar: string[] };
  images: string[];
  active: boolean;
};

export default function ProductForm({
  initial,
}: {
  initial?: ProductFormValues;
}) {
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.set("file", file);
        const url = await uploadProductImage(formData);
        setImages((prev) => [...prev, url]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız oldu");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <form action={saveProduct} className="max-w-3xl space-y-8">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="images" value={images.join("\n")} />

      <section>
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-grey">
          Temel Bilgiler
        </h2>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-brand-grey">
                Slug (URL) — örn. yeni-korse-modeli-1234
              </label>
              <input
                name="slug"
                required
                defaultValue={initial?.slug}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-navy"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-grey">
                Ürün Kodu — fabrika/foto klasörü referansı, sadece sen görürsün
              </label>
              <input
                name="legacy_id"
                defaultValue={initial?.legacy_id ?? ""}
                placeholder="örn. 1810"
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-navy"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-semibold text-brand-grey">İsim (TR)</label>
              <input
                name="name_tr"
                required
                defaultValue={initial?.name.tr}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-navy"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-grey">İsim (EN)</label>
              <input
                name="name_en"
                defaultValue={initial?.name.en}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-navy"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-grey">İsim (AR)</label>
              <input
                name="name_ar"
                dir="rtl"
                defaultValue={initial?.name.ar}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-navy"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-grey">
          Kategori
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {CATEGORY_KEYS.map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="category_keys"
                value={key}
                defaultChecked={initial?.category_keys.includes(key)}
              />
              {key}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-grey">
          Renkler
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {COLOR_KEYS.map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="color_keys"
                value={key}
                defaultChecked={initial?.color_keys.includes(key)}
              />
              {key}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-grey">
          Ürün Özellikleri (her satır bir madde)
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-brand-grey">TR</label>
            <textarea
              name="features_tr"
              rows={6}
              defaultValue={initial?.features.tr.join("\n")}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-navy"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-grey">EN</label>
            <textarea
              name="features_en"
              rows={6}
              defaultValue={initial?.features.en.join("\n")}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-navy"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-grey">AR</label>
            <textarea
              name="features_ar"
              dir="rtl"
              rows={6}
              defaultValue={initial?.features.ar.join("\n")}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-navy"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-brand-grey">
          EN veya AR boş bırakılırsa, sitede o dilde TR metin gösterilir.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-grey">
          Görseller
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={img} className="relative h-24 w-20 overflow-hidden rounded-lg bg-brand-grey-light">
              <Image src={productImageUrl(img)} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="mt-4 text-sm"
        />
        {uploading && <p className="mt-2 text-xs text-brand-grey">Yükleniyor…</p>}
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </section>

      <section>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="active" defaultChecked={initial?.active ?? true} />
          Sitede yayında
        </label>
      </section>

      <button
        type="submit"
        className="rounded-full bg-brand-navy px-8 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white hover:bg-black"
      >
        Kaydet
      </button>
    </form>
  );
}
