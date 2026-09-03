"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { LeadStage } from "@/lib/supabase/types";

function listFromTextarea(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function saveProduct(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string | null;
  const slug = (formData.get("slug") as string).trim();

  const legacyId = (formData.get("legacy_id") as string | null)?.trim() || null;

  const payload = {
    slug,
    legacy_id: legacyId,
    name: {
      tr: (formData.get("name_tr") as string).trim(),
      en: (formData.get("name_en") as string).trim(),
      ar: (formData.get("name_ar") as string).trim(),
    },
    category_keys: formData.getAll("category_keys") as string[],
    color_keys: formData.getAll("color_keys") as string[],
    features: {
      tr: listFromTextarea(formData.get("features_tr")),
      en: listFromTextarea(formData.get("features_en")),
      ar: listFromTextarea(formData.get("features_ar")),
    },
    images: listFromTextarea(formData.get("images")),
    active: formData.get("active") === "on",
  };

  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("products").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/urunler");
  revalidatePath("/[locale]/katalog", "page");
  revalidatePath("/[locale]", "page");
  redirect("/admin/urunler");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/urunler");
  revalidatePath("/[locale]/katalog", "page");
  revalidatePath("/[locale]", "page");
}

export async function toggleProductActive(id: string, active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ active })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/urunler");
  revalidatePath("/[locale]/katalog", "page");
  revalidatePath("/[locale]", "page");
}

export async function uploadProductImage(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("Dosya seçilmedi");

  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(path);

  return publicUrl;
}

export async function updateLeadStage(id: string, stage: LeadStage) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ stage }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/pipeline");
  revalidatePath(`/admin/pipeline/${id}`);
}

export async function addLeadNote(id: string, body: string) {
  const supabase = await createClient();
  const trimmed = body.trim();
  if (!trimmed) return;

  const { error } = await supabase
    .from("lead_activities")
    .insert({ lead_id: id, type: "note", body: trimmed });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/pipeline/${id}`);
}

export async function updateLeadDetails(
  id: string,
  fields: { full_name: string; email: string; phone: string; estimated_value: number | null }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/pipeline");
  revalidatePath(`/admin/pipeline/${id}`);
}
