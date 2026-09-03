import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProductRow } from "@/lib/supabase/types";
import ProductForm from "../ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const product = data as ProductRow;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">{product.name.tr}</h1>
      <div className="mt-6">
        <ProductForm
          initial={{
            id: product.id,
            slug: product.slug,
            legacy_id: product.legacy_id,
            name: product.name,
            category_keys: product.category_keys,
            color_keys: product.color_keys,
            features: product.features,
            images: product.images,
            active: product.active,
          }}
        />
      </div>
    </div>
  );
}
