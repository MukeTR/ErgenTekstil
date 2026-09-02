import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { LeadActivityRow, LeadRow, LeadStage } from "@/lib/supabase/types";
import LeadDetail from "./LeadDetail";

const STAGES: { key: LeadStage; label: string }[] = [
  { key: "new", label: "Yeni" },
  { key: "contacted", label: "İletişime Geçildi" },
  { key: "quoted", label: "Teklif Verildi" },
  { key: "negotiating", label: "Görüşülüyor" },
  { key: "won", label: "Kazanıldı" },
  { key: "lost", label: "Kaybedildi" },
];

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: lead }, { data: activities }] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!lead) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/pipeline"
        className="text-xs font-semibold uppercase tracking-wide text-brand-grey hover:text-brand-navy"
      >
        ← Pipeline&apos;a dön
      </Link>
      <div className="mt-4">
        <LeadDetail
          lead={lead as LeadRow}
          activities={(activities ?? []) as LeadActivityRow[]}
          stages={STAGES}
        />
      </div>
    </div>
  );
}
