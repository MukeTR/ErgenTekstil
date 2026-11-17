"use server";

import { CATALOGUES, catalogueUrl } from "@/lib/catalogues";
import { getContent } from "@/lib/data";
import { sendCatalogueMail } from "@/lib/mail/catalogue-mail";
import { locales, type Locale } from "@/i18n/routing";
import { submitLead } from "./submit-lead";

const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;

/**
 * Ana sayfadaki katalog formu: talebi panele (leads) yazar ve ziyaretçiye
 * indirme bağlantısını e-postayla gönderir.
 * mailed=false ise e-posta gitmemiştir (anahtar yok / Resend hatası); talep yine kayıtlıdır.
 * Geçerli bir e-posta yazıldıysa indirme adresi (url) her durumda döner; form bunu
 * düğme olarak gösterir, böylece ziyaretçi e-postayı beklemeden kataloğu indirebilir.
 */
export async function requestCatalogue(input: {
  email: string;
  /** home.catalogues içindeki sıra */
  catalogueIndex: number;
  locale: string;
  metaEventId?: string;
  sourceUrl?: string;
}): Promise<{ ok: boolean; mailed: boolean; url?: string; sizeMb?: number }> {
  const email = (input.email ?? "").trim();
  const catalogue = CATALOGUES[input.catalogueIndex];
  if (!catalogue || email.length > 254 || !EMAIL_RE.test(email)) {
    return { ok: false, mailed: false };
  }

  const locale: Locale = (locales as readonly string[]).includes(input.locale)
    ? (input.locale as Locale)
    : "tr";
  const catalogueName = getContent(locale).home.catalogues[input.catalogueIndex];

  const lead = await submitLead({
    fullName: email,
    email,
    subject: `Katalog Talebi: ${catalogueName}`,
    message: `${catalogueName} için katalog talebi.`,
    productName: catalogueName,
    locale,
    metaEventId: input.metaEventId,
    metaEventName: "Lead",
    sourceUrl: input.sourceUrl,
  });

  const mailed = await sendCatalogueMail({ to: email, catalogue, catalogueName, locale });

  return { ok: lead.ok || mailed, mailed, url: catalogueUrl(catalogue), sizeMb: catalogue.sizeMb };
}
