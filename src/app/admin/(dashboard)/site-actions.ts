"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SITE_IMAGE_SLOTS } from "@/lib/site-media";
import { routing } from "@/i18n/routing";

const SLOT_KEYS = new Set<string>(SITE_IMAGE_SLOTS.map((s) => s.key));

function assertImageUrl(url: string) {
  // Yalnız kendi Supabase depomuz ya da sitenin kendi dosyaları
  const ok =
    url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`) ||
    /^\/[A-Za-z0-9/_.-]+$/.test(url);
  if (!ok) throw new Error("Geçersiz görsel adresi");
}

export async function setSiteImage(key: string, url: string) {
  if (!SLOT_KEYS.has(key)) throw new Error("Bilinmeyen görsel alanı");
  assertImageUrl(url);
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_images")
    .upsert({ key, url, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/gorseller");
}

export async function resetSiteImage(key: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("site_images").delete().eq("key", key);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/gorseller");
}

export type HeroSlideInput = {
  id?: string;
  active: boolean;
  title: Record<string, string>;
  subtitle: Record<string, string>;
  images: string[];
};

function cleanText(input: Record<string, string>) {
  return Object.fromEntries(
    routing.locales.map((l) => [l, (input[l] ?? "").trim()]).filter(([, v]) => v)
  );
}

export async function saveHeroSlide(input: HeroSlideInput) {
  const title = cleanText(input.title);
  if (!title.tr) throw new Error("Türkçe başlık zorunlu");
  const images = input.images.filter(Boolean);
  if (images.length !== 3) throw new Error("Slayt için 3 görsel gerekli");
  images.forEach(assertImageUrl);

  const supabase = await createClient();
  const payload = {
    active: input.active,
    title,
    subtitle: cleanText(input.subtitle),
    images,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { error } = await supabase.from("hero_slides").update(payload).eq("id", input.id);
    if (error) throw new Error(error.message);
  } else {
    const { data: last } = await supabase
      .from("hero_slides")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { error } = await supabase
      .from("hero_slides")
      .insert({ ...payload, position: (last?.position ?? 0) + 1 });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/slider");
}

export async function deleteHeroSlide(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/slider");
}

/** Slaydı bir üst/alt sıradakiyle yer değiştirir. */
export async function moveHeroSlide(id: string, direction: -1 | 1) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, position")
    .order("position");
  if (error) throw new Error(error.message);
  const i = data.findIndex((s) => s.id === id);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= data.length) return;
  // Sıralar tekrar 1..n olarak yazılır; eski boşluklar/çakışmalar da düzelir
  const order = data.map((s) => s.id);
  [order[i], order[j]] = [order[j], order[i]];
  const { error: upErr } = await supabase
    .from("hero_slides")
    .upsert(order.map((sid, k) => ({ id: sid, position: k + 1 })), { onConflict: "id" });
  if (upErr) throw new Error(upErr.message);
  revalidatePath("/admin/slider");
}
