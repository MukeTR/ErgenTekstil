"use client";

/**
 * Form gönderimi: statik sitede sunucu aksiyonu yok; Apache/PHP uç noktası
 * (public/api/lead.php) e-postayı yollar, kaydı CSV'ye yazar ve Meta CAPI'ye iletir.
 */

export type LeadEventName = "Lead" | "Subscribe" | "Contact";

export async function submitLead(input: {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  productName?: string;
  locale: string;
  /** Tarayıcıdaki Pixel olayıyla aynı id → Meta'da tekilleştirme */
  metaEventId?: string;
  /** Varsayılan Lead; bülten için Subscribe */
  metaEventName?: LeadEventName;
  sourceUrl?: string;
}): Promise<{ ok: boolean }> {
  try {
    const res = await fetch("/api/lead.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) return { ok: false };
    const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    return { ok: Boolean(data?.ok) };
  } catch {
    return { ok: false };
  }
}
