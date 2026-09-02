import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { LeadStage } from "@/lib/supabase/types";

const STAGE_LABELS: Record<LeadStage, string> = {
  new: "Yeni",
  contacted: "İletişime Geçildi",
  quoted: "Teklif Verildi",
  negotiating: "Görüşülüyor",
  won: "Kazanıldı",
  lost: "Kaybedildi",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: productCount }, { count: activeProductCount }, { data: leads }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("active", true),
      supabase.from("leads").select("stage"),
    ]);

  const stageCounts: Record<string, number> = {};
  for (const lead of leads ?? []) {
    stageCounts[lead.stage] = (stageCounts[lead.stage] ?? 0) + 1;
  }
  const openLeads = (leads ?? []).filter(
    (l) => l.stage !== "won" && l.stage !== "lost"
  ).length;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Panel</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey">
            Ürünler
          </p>
          <p className="mt-2 font-heading text-3xl font-extrabold">
            {activeProductCount ?? 0}
            <span className="text-base font-medium text-brand-grey">
              {" "}
              / {productCount ?? 0} toplam
            </span>
          </p>
          <Link
            href="/admin/urunler"
            className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-brand-navy underline"
          >
            Yönet
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey">
            Açık Talepler
          </p>
          <p className="mt-2 font-heading text-3xl font-extrabold">{openLeads}</p>
          <Link
            href="/admin/pipeline"
            className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-brand-navy underline"
          >
            Pipeline&apos;a git
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey">
            Toplam Talep
          </p>
          <p className="mt-2 font-heading text-3xl font-extrabold">
            {leads?.length ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-grey">
          Aşamaya göre dağılım
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {(Object.keys(STAGE_LABELS) as LeadStage[]).map((stage) => (
            <div key={stage} className="rounded-xl bg-brand-grey-light p-4 text-center">
              <p className="font-heading text-2xl font-extrabold">
                {stageCounts[stage] ?? 0}
              </p>
              <p className="mt-1 text-xs text-brand-grey">{STAGE_LABELS[stage]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
