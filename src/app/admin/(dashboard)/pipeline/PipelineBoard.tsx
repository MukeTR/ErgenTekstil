"use client";

import { useTransition } from "react";
import Link from "next/link";
import type { LeadRow, LeadStage } from "@/lib/supabase/types";
import { updateLeadStage } from "../actions";

export default function PipelineBoard({
  stages,
  leads,
}: {
  stages: { key: LeadStage; label: string }[];
  leads: LeadRow[];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-4 overflow-x-auto lg:grid-cols-6">
      {stages.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage.key);
        return (
          <div key={stage.key} className="min-w-[220px] rounded-2xl bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-heading text-xs font-bold uppercase tracking-wide text-brand-grey">
                {stage.label}
              </h2>
              <span className="text-xs text-brand-grey">{stageLeads.length}</span>
            </div>
            <div className="mt-3 space-y-3">
              {stageLeads.map((lead) => (
                <div key={lead.id} className="rounded-xl border border-black/5 p-3">
                  <Link
                    href={`/admin/pipeline/${lead.id}`}
                    className="block font-heading text-sm font-semibold text-brand-navy hover:underline"
                  >
                    {lead.full_name || lead.email || "İsimsiz talep"}
                  </Link>
                  {lead.product_name && (
                    <p className="mt-1 line-clamp-2 text-xs text-brand-grey">
                      {lead.product_name}
                    </p>
                  )}
                  <p className="mt-2 text-[11px] text-brand-grey">
                    {new Date(lead.created_at).toLocaleDateString("tr-TR")}
                  </p>
                  <select
                    value={lead.stage}
                    disabled={isPending}
                    onChange={(e) =>
                      startTransition(() =>
                        updateLeadStage(lead.id, e.target.value as LeadStage)
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-black/10 px-2 py-1 text-xs"
                  >
                    {stages.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              {stageLeads.length === 0 && (
                <p className="px-1 text-xs text-brand-grey/60">Boş</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
