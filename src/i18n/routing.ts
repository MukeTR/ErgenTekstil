import { defineRouting } from "next-intl/routing";

export const locales = ["tr", "en", "ar", "de", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
