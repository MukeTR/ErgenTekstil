-- Panelden yönetilen site görselleri ve ana sayfa slider'ı (30 Eyl 2026)

-- Sayfalardaki sabit görsel yuvaları: satır yoksa koddaki varsayılan görsel kullanılır
create table if not exists public.site_images (
  key text primary key,
  url text not null,
  updated_at timestamptz not null default now()
);

-- Ana sayfa slider'ı: 5 dilde başlık/alt metin + 3 görsel
create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  active boolean not null default true,
  title jsonb not null default '{}'::jsonb,
  subtitle jsonb not null default '{}'::jsonb,
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_images enable row level security;
alter table public.hero_slides enable row level security;

create policy "site images are publicly readable" on public.site_images
  for select to anon, authenticated using (true);
create policy "admin can manage site images" on public.site_images
  for all to authenticated using (true) with check (true);

create policy "active hero slides are publicly readable" on public.hero_slides
  for select to anon using (active);
create policy "admin can manage hero slides" on public.hero_slides
  for all to authenticated using (true) with check (true);

grant select on public.site_images, public.hero_slides to anon;
grant select, insert, update, delete on public.site_images, public.hero_slides to authenticated;

-- Bugünkü slider birebir
insert into public.hero_slides (position, title, subtitle, images)
select * from (values
  (1, '{"tr": "Dikişsiz Giyim Teknolojisi", "en": "Seamless Apparel Technology", "ar": "تقنية الملابس بلا خياطة", "de": "Seamless-Bekleidungstechnologie", "ru": "Технология бесшовной одежды"}'::jsonb, '{"tr": "Spor, İç, Günlük, Termal ve Şekillendirici Giyim için imalat yapıyor, üç kıtaya ihraç ediyoruz.", "en": "We manufacture Sportswear, Underwear, Everyday, Thermal and Shapewear, exporting to three continents.", "ar": "نصنّع الملابس الرياضية والداخلية واليومية والحرارية والمشكّلة للجسم، ونصدّر إلى ثلاث قارات.", "de": "Wir fertigen Sport-, Unter-, Alltags-, Thermo- und Shapewear-Bekleidung und exportieren auf drei Kontinente.", "ru": "Мы производим спортивную, нижнюю, повседневную, термо- и корректирующую одежду и экспортируем на три континента."}'::jsonb, array['/images/factory-floor.webp', '/blog/Fuar-Blog.webp', '/sureclerimiz/step-7-dikim.webp']),
  (2, '{"tr": "Yüksek Kalite", "en": "High Quality", "ar": "جودة عالية", "de": "Hohe Qualität", "ru": "Высокое качество"}'::jsonb, '{"tr": "Spor giyim, iç giyim ve şekillendirici giyim ürünlerinde yüksek kalite ve iddialı tasarımlarımız ile yüksek pazar payımız ile hizmet veriyoruz.", "en": "We serve with high quality and bold designs in sportswear, underwear and shapewear, backed by a strong market share.", "ar": "نقدّم خدماتنا في الملابس الرياضية والداخلية والمشكّلة للجسم بجودة عالية وتصاميم جريئة، مع حصة سوقية كبيرة.", "de": "Mit hoher Qualität und anspruchsvollen Designs in den Bereichen Sportbekleidung, Unterwäsche und Shapewear bedienen wir unsere Kunden mit einem starken Marktanteil.", "ru": "Мы работаем с высоким качеством и смелым дизайном в сегментах спортивной одежды, нижнего и корректирующего белья, удерживая значительную долю рынка."}'::jsonb, array['https://mxjyyywiooxikcwfylys.supabase.co/storage/v1/object/public/product-images/1510/0-Y1.png.webp', 'https://mxjyyywiooxikcwfylys.supabase.co/storage/v1/object/public/product-images/1550/0-ATOS6988.jpg.webp', 'https://mxjyyywiooxikcwfylys.supabase.co/storage/v1/object/public/product-images/1625/0-ATOS4165.jpg.webp']),
  (3, '{"tr": "Kendine Güven, Rahat Hisset", "en": "Feel Confident, Feel Comfortable", "ar": "ثقة بالنفس، راحة تامة", "de": "Selbstbewusst und wohlfühlen", "ru": "Уверенность и комфорт"}'::jsonb, '{"tr": "Kusursuz Kalıplar, Şık Tasarımlar, Rahat Dokularla İç Giyimin En Güzel Hali", "en": "The finest underwear, made with flawless patterns, stylish designs and comfortable fabrics", "ar": "أفضل ما في الملابس الداخلية، بقوالب مثالية وتصاميم أنيقة وأقمشة مريحة", "de": "Die schönste Seite der Unterwäsche – mit perfekten Schnitten, eleganten Designs und angenehmen Materialien", "ru": "Лучшее в нижнем белье — безупречные лекала, стильный дизайн и комфортные материалы"}'::jsonb, array['https://mxjyyywiooxikcwfylys.supabase.co/storage/v1/object/public/product-images/1060/0-FAC_2166.jpg.webp', 'https://mxjyyywiooxikcwfylys.supabase.co/storage/v1/object/public/product-images/2210/0-FAC_3357.jpg.webp', 'https://mxjyyywiooxikcwfylys.supabase.co/storage/v1/object/public/product-images/1040/0-FAC_1222.jpg.webp'])
) as v(position, title, subtitle, images)
where not exists (select 1 from public.hero_slides);
