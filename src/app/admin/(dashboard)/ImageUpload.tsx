"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "product-images";

/**
 * Fotoğrafı tarayıcıda küçültüp webp'ye çevirir ve doğrudan Supabase Storage'a yükler.
 * Sunucu eyleminin 1 MB gövde sınırına takılmaz; sitede büyük fotoğraf yayına çıkmaz.
 */
async function toWebp(file: File, maxSize: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85)
  );
  if (!blob) throw new Error("Görsel dönüştürülemedi");
  return blob;
}

export async function uploadSiteImage(file: File, maxSize = 1920): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Lütfen bir görsel dosyası seçin");
  const blob = await toWebp(file, maxSize);
  const supabase = createClient();
  const path = `site/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export default function ImageUpload({
  label = "Görsel yükle",
  maxSize,
  onUploaded,
}: {
  label?: string;
  maxSize?: number;
  onUploaded: (url: string) => void | Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      await onUploaded(await uploadSiteImage(file, maxSize));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız oldu");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="rounded-full bg-brand-navy px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-navy/90 disabled:opacity-50"
      >
        {busy ? "Yükleniyor…" : label}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
