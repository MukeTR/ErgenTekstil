import { createClient } from "@/lib/supabase/server";
import type { HeroSlideRow } from "@/lib/site-media";
import SlideEditor from "./SlideEditor";

export const dynamic = "force-dynamic";

export default async function AdminSliderPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, position, active, title, subtitle, images")
    .order("position");
  const slides = (data ?? []) as HeroSlideRow[];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Ana Sayfa Slider</h1>
      <p className="mt-2 max-w-2xl text-sm text-brand-grey">
        Slaytlar ana sayfada bu sırayla, 6 saniyede bir döner. Her slaytta 3 görsel olmalı.
        Boş bırakılan dilde Türkçe metin gösterilir. Kaydettiğiniz değişiklik sitede hemen görünür.
      </p>
      {error && <p className="mt-4 text-sm text-red-600">{error.message}</p>}

      <div className="mt-8 space-y-6">
        {slides.map((s, i) => (
          <SlideEditor key={s.id} slide={s} index={i} total={slides.length} />
        ))}
        <SlideEditor index={slides.length} total={slides.length} />
      </div>
    </div>
  );
}
