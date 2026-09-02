import { createClient } from "@/lib/supabase/server";
import type { LeadRow, LeadStage } from "@/lib/supabase/types";
import PipelineBoard from "./PipelineBoard";

export const dynamic = "force-dynamic";

const STAGES: { key: LeadStage; label: string }[] = [
  { key: "new", label: "Yeni" },
  { key: "contacted", label: "İletişime Geçildi" },
  { key: "quoted", label: "Teklif Verildi" },
  { key: "negotiating", label: "Görüşülüyor" },
  { key: "won", label: "Kazanıldı" },
  { key: "lost", label: "Kaybedildi" },
];

export default async function PipelinePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const leads = (data ?? []) as LeadRow[];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Satış Pipeline</h1>
      <p className="mt-1 text-sm text-brand-grey">
        Web sitesindeki &quot;Teklif Al&quot; formundan gelen talepler otomatik olarak
        burada &quot;Yeni&quot; aşamasında görünür.
      </p>
      <div className="mt-6">
        <PipelineBoard stages={STAGES} leads={leads} />
      </div>
    </div>
  );
}
