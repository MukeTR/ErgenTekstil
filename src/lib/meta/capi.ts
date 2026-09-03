import "server-only";

import { createHash } from "crypto";
import { headers, cookies } from "next/headers";

/**
 * Meta Conversions API (sunucu tarafı). Tarayıcıdaki Pixel olayı ile aynı
 * `eventId` gönderilir; Meta çift sayımı önler. Access token asla tarayıcıya
 * gitmez — yalnızca sunucu ortam değişkeninden okunur.
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN ?? "";
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE ?? "";
const GRAPH_VERSION = "v21.0";

export type CapiEventName = "Lead" | "Subscribe" | "Contact" | "ViewContent" | "PageView";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email?: string | null): string | undefined {
  const v = email?.trim().toLowerCase();
  return v ? sha256(v) : undefined;
}

function normalizePhone(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  // Türkiye için: 05xx → 905xx, 5xx → 905xx
  if (digits.startsWith("0")) digits = `9${digits}`;
  else if (digits.length === 10 && digits.startsWith("5")) digits = `90${digits}`;
  return sha256(digits);
}

function normalizeName(name?: string | null): string | undefined {
  const v = name?.trim().toLowerCase();
  return v ? sha256(v) : undefined;
}

export async function sendCapiEvent(input: {
  eventName: CapiEventName;
  eventId: string;
  sourceUrl?: string;
  email?: string | null;
  phone?: string | null;
  fullName?: string | null;
  customData?: Record<string, unknown>;
}): Promise<void> {
  if (!PIXEL_ID || !ACCESS_TOKEN) return;

  const h = await headers();
  const c = await cookies();

  const forwarded = h.get("x-forwarded-for");
  const clientIp = forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || undefined;
  const userAgent = h.get("user-agent") || undefined;
  const referer = h.get("referer") || undefined;

  const userData: Record<string, unknown> = {
    client_ip_address: clientIp,
    client_user_agent: userAgent,
    fbp: c.get("_fbp")?.value,
    fbc: c.get("_fbc")?.value,
  };

  const em = normalizeEmail(input.email);
  if (em) userData.em = [em];
  const ph = normalizePhone(input.phone);
  if (ph) userData.ph = [ph];

  // Ad-soyad tek alandaysa ilk kelime = ad, geri kalanı = soyad
  if (input.fullName) {
    const parts = input.fullName.trim().split(/\s+/);
    const fn = normalizeName(parts[0]);
    const ln = parts.length > 1 ? normalizeName(parts.slice(1).join(" ")) : undefined;
    if (fn) userData.fn = [fn];
    if (ln) userData.ln = [ln];
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.sourceUrl || referer,
        action_source: "website",
        user_data: userData,
        custom_data: input.customData,
      },
    ],
  };
  if (TEST_EVENT_CODE) payload.test_event_code = TEST_EVENT_CODE;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // Formu bekletmeyelim; kısa timeout
        signal: AbortSignal.timeout(4000),
      }
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Meta CAPI error:", res.status, text.slice(0, 300));
    }
  } catch (err) {
    console.error("Meta CAPI request failed:", err instanceof Error ? err.message : err);
  }
}
