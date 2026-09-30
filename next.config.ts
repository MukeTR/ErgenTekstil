import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Adresler ergentekstil.com'daki (ve sitemap'teki) gibi eğik çizgiyle biter
  trailingSlash: true,
  images: {
    // Görseller zaten küçük webp (Supabase + public); Workers'ta optimizasyon servisi yok
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mxjyyywiooxikcwfylys.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

initOpenNextCloudflareForDev();
