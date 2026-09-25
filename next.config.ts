import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Güzel Hosting (cPanel/Apache) için tamamen statik çıktı: out/ → public_html
  output: "export",
  // /tr/katalog → /tr/katalog/index.html; Apache dizin index'iyle doğal çalışır
  trailingSlash: true,
  images: {
    // Görseller zaten webp; statik hostingde optimizasyon sunucusu yok
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
