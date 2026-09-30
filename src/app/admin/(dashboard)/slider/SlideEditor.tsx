"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import type { HeroSlideRow } from "@/lib/site-media";
import ImageUpload from "../ImageUpload";
import { deleteHeroSlide, moveHeroSlide, saveHeroSlide } from "../site-actions";

const LANGS = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "İngilizce" },
  { code: "ar", label: "Arapça" },
  { code: "de", label: "Almanca" },
  { code: "ru", label: "Rusça" },
] as const;

const input =
  "mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-navy";

export default function SlideEditor({
  slide,
  index,
  total,
}: {
  /** Yoksa "yeni slayt" formu */
  slide?: HeroSlideRow;
  index: number;
  total: number;
}) {
  const isNew = !slide;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<Record<string, string>>({ ...(slide?.title ?? {}) });
  const [subtitle, setSubtitle] = useState<Record<string, string>>({ ...(slide?.subtitle ?? {}) });
  const [images, setImages] = useState<string[]>(slide?.images ?? ["", "", ""]);
  const [active, setActive] = useState(slide?.active ?? true);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function run(fn: () => Promise<void>, okText: string) {
    setMessage(null);
    startTransition(async () => {
      try {
        await fn();
        setMessage({ ok: true, text: okText });
      } catch (e) {
        setMessage({ ok: false, text: e instanceof Error ? e.message : "İşlem başarısız" });
      }
    });
  }

  function save() {
    run(async () => {
      await saveHeroSlide({ id: slide?.id, active, title, subtitle, images });
      if (isNew) {
        setTitle({});
        setSubtitle({});
        setImages(["", "", ""]);
        setOpen(false);
      }
    }, isNew ? "Slayt eklendi" : "Kaydedildi");
  }

  if (isNew && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border-2 border-dashed border-black/10 py-6 font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey transition hover:border-brand-navy hover:text-brand-navy"
      >
        + Yeni slayt ekle
      </button>
    );
  }

  return (
    <div className={`rounded-2xl bg-white p-6 shadow-sm ${active ? "" : "opacity-70"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-grey">
          {isNew ? "Yeni slayt" : `Slayt ${index + 1}`}
          {!isNew && !active && <span className="ml-2 text-red-600">(gizli)</span>}
        </h2>
        {!isNew && (
          <div className="flex items-center gap-2 text-xs">
            <button type="button" disabled={pending || index === 0}
              onClick={() => run(() => moveHeroSlide(slide.id, -1), "Sıra değişti")}
              className="rounded-full border border-black/10 px-3 py-1.5 disabled:opacity-30">↑ Yukarı</button>
            <button type="button" disabled={pending || index === total - 1}
              onClick={() => run(() => moveHeroSlide(slide.id, 1), "Sıra değişti")}
              className="rounded-full border border-black/10 px-3 py-1.5 disabled:opacity-30">↓ Aşağı</button>
            <button type="button" disabled={pending}
              onClick={() => { if (confirm("Bu slayt silinsin mi?")) run(() => deleteHeroSlide(slide.id), "Silindi"); }}
              className="rounded-full border border-red-200 px-3 py-1.5 text-red-600">Sil</button>
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        {images.map((src, i) => (
          <div key={i}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-brand-grey-light">
              {src && <Image src={src} alt="" fill sizes="200px" className="object-cover" />}
            </div>
            <div className="mt-2">
              <ImageUpload
                label={src ? "Değiştir" : "Görsel yükle"}
                maxSize={1400}
                onUploaded={(u) => setImages((prev) => prev.map((p, k) => (k === i ? u : p)))}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {LANGS.map((l) => (
          <div key={l.code} className="grid gap-3 sm:grid-cols-[7rem_1fr_1.6fr] sm:items-start">
            <span className="pt-3 text-xs font-semibold text-brand-grey">{l.label}</span>
            <input
              placeholder="Başlık"
              dir={l.code === "ar" ? "rtl" : undefined}
              value={title[l.code] ?? ""}
              onChange={(e) => setTitle({ ...title, [l.code]: e.target.value })}
              className={input}
            />
            <textarea
              placeholder="Alt metin"
              rows={2}
              dir={l.code === "ar" ? "rtl" : undefined}
              value={subtitle[l.code] ?? ""}
              onChange={(e) => setSubtitle({ ...subtitle, [l.code]: e.target.value })}
              className={input}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Sitede göster
        </label>
        <button
          type="button"
          disabled={pending}
          onClick={save}
          className="rounded-full bg-brand-navy px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-white hover:bg-black disabled:opacity-50"
        >
          {pending ? "Kaydediliyor…" : isNew ? "Slaytı ekle" : "Kaydet"}
        </button>
        {isNew && (
          <button type="button" onClick={() => setOpen(false)} className="text-xs text-brand-grey underline">
            Vazgeç
          </button>
        )}
        {message && (
          <span className={`text-sm ${message.ok ? "text-green-700" : "text-red-600"}`}>{message.text}</span>
        )}
      </div>
    </div>
  );
}
