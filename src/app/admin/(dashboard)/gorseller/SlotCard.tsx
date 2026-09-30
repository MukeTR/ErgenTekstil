"use client";

import { useTransition } from "react";
import Image from "next/image";
import ImageUpload from "../ImageUpload";
import { resetSiteImage, setSiteImage } from "../site-actions";

export default function SlotCard({
  slotKey,
  label,
  url,
  customized,
}: {
  slotKey: string;
  label: string;
  url: string;
  customized: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative aspect-[16/10] bg-brand-grey-light">
        <Image src={url} alt="" fill sizes="400px" className="object-cover" />
        {customized && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-navy px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Değiştirildi
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="text-sm font-semibold text-brand-navy">{label}</p>
        <div className="flex shrink-0 items-center gap-2">
          <ImageUpload
            label="Değiştir"
            onUploaded={(u) => startTransition(() => setSiteImage(slotKey, u))}
          />
          {customized && (
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => resetSiteImage(slotKey))}
              className="text-xs text-brand-grey underline disabled:opacity-50"
            >
              Varsayılana dön
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
