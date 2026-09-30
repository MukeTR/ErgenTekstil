import { createClient } from "@/lib/supabase/server";
import { SITE_IMAGE_SLOTS } from "@/lib/site-media";
import SlotCard from "./SlotCard";

export const dynamic = "force-dynamic";

export default async function AdminSiteImagesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_images").select("key, url, updated_at");
  const overrides = new Map((data ?? []).map((r) => [r.key as string, r]));
  const pages = [...new Set(SITE_IMAGE_SLOTS.map((s) => s.page))];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Sayfa Görselleri</h1>
      <p className="mt-2 max-w-2xl text-sm text-brand-grey">
        Yüklediğiniz görsel sitede hemen görünür. Fotoğraflar yüklenirken otomatik küçültülür.
        &quot;Varsayılana dön&quot; ilk görsele geri getirir. Ana sayfa slider&apos;ı için{" "}
        <a href="/admin/slider" className="underline">Slider</a> sekmesini kullanın.
      </p>
      {error && <p className="mt-4 text-sm text-red-600">{error.message}</p>}

      {pages.map((page) => (
        <section key={page} className="mt-10">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-grey">
            {page}
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SITE_IMAGE_SLOTS.filter((s) => s.page === page).map((s) => {
              const o = overrides.get(s.key);
              return (
                <SlotCard
                  key={s.key}
                  slotKey={s.key}
                  label={s.label}
                  url={o?.url ?? s.fallback}
                  customized={Boolean(o)}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
