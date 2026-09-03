"use server";

import { supabasePublic } from "@/lib/supabase/public";
import { sendCapiEvent, type CapiEventName } from "@/lib/meta/capi";

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
  metaEventName?: CapiEventName;
  sourceUrl?: string;
}) {
  const { error } = await supabasePublic.from("leads").insert({
    full_name: input.fullName,
    email: input.email,
    phone: input.phone || null,
    subject: input.subject,
    message: input.message,
    product_name: input.productName || null,
    locale: input.locale,
    source: "web_form",
  });

  if (error) {
    console.error("submitLead failed:", error.message);
    return { ok: false };
  }

  if (input.metaEventId) {
    // Kayıt başarılı → sunucu tarafı dönüşüm. Formu bekletmemek için await'siz değil;
    // Next server action'ında yanıt dönmeden önce kısa timeout'la tamamlanır.
    await sendCapiEvent({
      eventName: input.metaEventName ?? "Lead",
      eventId: input.metaEventId,
      sourceUrl: input.sourceUrl,
      email: input.email,
      phone: input.phone,
      fullName: input.fullName !== input.email ? input.fullName : undefined,
      customData: {
        content_name: input.productName || input.subject,
        content_category: input.subject,
        locale: input.locale,
      },
    });
  }

  return { ok: true };
}
