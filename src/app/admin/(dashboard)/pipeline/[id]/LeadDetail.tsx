"use client";

import { useState, useTransition } from "react";
import type { LeadActivityRow, LeadRow, LeadStage } from "@/lib/supabase/types";
import { addLeadNote, updateLeadDetails, updateLeadStage } from "../../actions";

const STAGE_LABELS: Record<LeadStage, string> = {
  new: "Yeni",
  contacted: "İletişime Geçildi",
  quoted: "Teklif Verildi",
  negotiating: "Görüşülüyor",
  won: "Kazanıldı",
  lost: "Kaybedildi",
};

export default function LeadDetail({
  lead,
  activities,
  stages,
}: {
  lead: LeadRow;
  activities: LeadActivityRow[];
  stages: { key: LeadStage; label: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [fullName, setFullName] = useState(lead.full_name ?? "");
  const [email, setEmail] = useState(lead.email ?? "");
  const [phone, setPhone] = useState(lead.phone ?? "");
  const [value, setValue] = useState(lead.estimated_value?.toString() ?? "");

  function saveDetails() {
    startTransition(() =>
      updateLeadDetails(lead.id, {
        full_name: fullName,
        email,
        phone,
        estimated_value: value ? Number(value) : null,
      })
    );
  }

  function submitNote() {
    if (!note.trim()) return;
    startTransition(() => addLeadNote(lead.id, note));
    setNote("");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold">
            {lead.full_name || lead.email || "İsimsiz talep"}
          </h1>
          <select
            value={lead.stage}
            disabled={isPending}
            onChange={(e) =>
              startTransition(() =>
                updateLeadStage(lead.id, e.target.value as LeadStage)
              )
            }
            className="rounded-lg border border-black/10 px-3 py-1.5 text-sm"
          >
            {stages.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase text-brand-grey">Ürün</dt>
            <dd className="mt-1">{lead.product_name || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-brand-grey">Kaynak</dt>
            <dd className="mt-1">{lead.source}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-brand-grey">Konu</dt>
            <dd className="mt-1">{lead.subject || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-brand-grey">Tarih</dt>
            <dd className="mt-1">
              {new Date(lead.created_at).toLocaleString("tr-TR")}
            </dd>
          </div>
        </dl>

        {lead.message && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase text-brand-grey">Mesaj</p>
            <p className="mt-1 whitespace-pre-line text-sm text-brand-grey">
              {lead.message}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-grey">
          İletişim Bilgileri
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ad Soyad"
            className="rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta"
            className="rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Telefon"
            className="rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Tahmini Değer (₺)"
            type="number"
            className="rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={saveDetails}
          disabled={isPending}
          className="mt-4 rounded-full bg-brand-navy px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-white hover:bg-black disabled:opacity-50"
        >
          Kaydet
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-grey">
          Not Ekle
        </h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mt-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={submitNote}
          disabled={isPending}
          className="mt-3 rounded-full bg-brand-navy px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-white hover:bg-black disabled:opacity-50"
        >
          Ekle
        </button>

        <div className="mt-6 space-y-3">
          {activities.map((a) => (
            <div key={a.id} className="border-l-2 border-brand-grey-light pl-4 text-sm">
              <p className="text-[11px] text-brand-grey">
                {new Date(a.created_at).toLocaleString("tr-TR")}
              </p>
              {a.type === "note" ? (
                <p className="mt-1">{a.body}</p>
              ) : (
                <p className="mt-1 text-brand-grey">
                  Aşama değişti:{" "}
                  <span className="font-medium text-brand-navy">
                    {a.from_stage ? STAGE_LABELS[a.from_stage] : "—"} →{" "}
                    {a.to_stage ? STAGE_LABELS[a.to_stage] : "—"}
                  </span>
                </p>
              )}
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-xs text-brand-grey">Henüz aktivite yok.</p>
          )}
        </div>
      </div>
    </div>
  );
}
