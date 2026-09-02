"use server";

import { supabasePublic } from "@/lib/supabase/public";

export async function submitLead(input: {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  productName?: string;
  locale: string;
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

  return { ok: true };
}
