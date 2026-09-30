import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Blog, hakkımızda gibi derleme anında üretilen sayfalar statik varlıklardan okunur.
// Ürün ve katalog sayfaları her istekte Supabase'den okunduğu için ayrıca ISR deposu gerekmez.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
