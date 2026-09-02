import { createClient } from "@supabase/supabase-js";

// Plain (cookie-less) client for public, unauthenticated reads (the live
// catalogue). Kept separate from the SSR client so product/category pages
// can still be cached/ISR'd instead of being forced fully dynamic just
// because next/headers cookies() was touched.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);
