-- Ergen Tekstil admin + CRM schema
-- Products power the public catalogue (replacing the static JSON files).
-- Leads + lead_activities power the sales pipeline fed by the "Teklif Al" form.

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  legacy_id text,
  name jsonb not null default '{}'::jsonb, -- { tr, en, ar }
  category_keys text[] not null default '{}',
  color_keys text[] not null default '{}',
  features jsonb not null default '{}'::jsonb, -- { tr: string[], en: string[], ar: string[] }
  images text[] not null default '{}', -- filename (public/urunler/*) or full Storage URL
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_sort_idx on public.products (active, sort_order);
create index if not exists products_category_keys_idx on public.products using gin (category_keys);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  phone text,
  subject text,
  message text,
  product_name text,
  locale text,
  source text not null default 'web_form' check (source in ('web_form', 'manual', 'whatsapp', 'phone', 'email')),
  stage text not null default 'new' check (stage in ('new', 'contacted', 'quoted', 'negotiating', 'won', 'lost')),
  estimated_value numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_stage_idx on public.leads (stage, created_at desc);

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  type text not null check (type in ('note', 'stage_change')),
  body text,
  from_stage text,
  to_stage text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create index if not exists lead_activities_lead_id_idx on public.lead_activities (lead_id, created_at);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- log stage changes into lead_activities automatically
create or replace function public.log_lead_stage_change()
returns trigger
language plpgsql
as $$
begin
  if new.stage is distinct from old.stage then
    insert into public.lead_activities (lead_id, type, from_stage, to_stage)
    values (new.id, 'stage_change', old.stage, new.stage);
  end if;
  return new;
end;
$$;

drop trigger if exists leads_log_stage_change on public.leads;
create trigger leads_log_stage_change
  after update on public.leads
  for each row execute function public.log_lead_stage_change();

-- Row Level Security
alter table public.products enable row level security;
alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;

-- Products: anyone can read active products (public catalogue); only
-- authenticated (admin) users can write. Public signup is disabled in
-- Supabase Auth, so "authenticated" always means the admin.
create policy "products are publicly readable when active"
  on public.products for select
  to anon, authenticated
  using (active = true or auth.role() = 'authenticated');

create policy "admin can insert products"
  on public.products for insert
  to authenticated
  with check (true);

create policy "admin can update products"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

create policy "admin can delete products"
  on public.products for delete
  to authenticated
  using (true);

-- Leads: the public quote form may insert a new lead, but may never read,
-- edit or delete leads (that's the CRM's job, admin-only).
create policy "anyone can submit a lead"
  on public.leads for insert
  to anon, authenticated
  with check (true);

create policy "admin can read leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "admin can update leads"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);

create policy "admin can delete leads"
  on public.leads for delete
  to authenticated
  using (true);

-- Lead activities: admin-only in every direction (stage-change rows are
-- inserted by the trigger above, which runs as the table owner and bypasses
-- RLS; manual notes are inserted by the admin UI as an authenticated user).
create policy "admin can read lead activities"
  on public.lead_activities for select
  to authenticated
  using (true);

create policy "admin can insert lead activities"
  on public.lead_activities for insert
  to authenticated
  with check (true);

-- Storage bucket for product images uploaded from the admin panel.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product images are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "admin can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "admin can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "admin can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
