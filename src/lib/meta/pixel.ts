/**
 * Meta Pixel (tarayıcı tarafı) yardımcıları.
 *
 * Akış: Pixel → standart olaylar → (Google Ads) → Conversions API.
 * Her olay bir `eventId` ile gönderilir; aynı id sunucudaki CAPI çağrısında da
 * kullanılır ki Meta iki kaynaktan gelen olayı tek sayar (deduplication).
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

export type MetaStandardEvent =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "Contact"
  | "Subscribe"
  | "Search";

type FbqFn = (
  action: "init" | "track" | "trackCustom" | "consent",
  ...args: unknown[]
) => void;

declare global {
  interface Window {
    fbq?: FbqFn & { loaded?: boolean; queue?: unknown[] };
    _fbq?: unknown;
  }
}

export function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function trackMetaEvent(
  name: MetaStandardEvent,
  params: Record<string, unknown> = {},
  eventId: string = newEventId()
): string {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", name, params, { eventID: eventId });
  }
  return eventId;
}

/** Tarayıcıdaki _fbp / _fbc çerezlerini okur; CAPI eşleştirme kalitesi için. */
export function readMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  const out: { fbp?: string; fbc?: string } = {};
  for (const part of document.cookie.split(";")) {
    const [k, v] = part.trim().split("=");
    if (k === "_fbp") out.fbp = v;
    if (k === "_fbc") out.fbc = v;
  }
  return out;
}
