import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // cPanel Node.js App (Güzel Hosting) için tek klasörlük sunucu paketi
  output: "standalone",
  images: {
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
