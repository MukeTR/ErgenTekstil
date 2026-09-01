"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = { tr: "TR", en: "EN", ar: "AR" };

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 rounded-full border border-black/10 p-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={`rounded-full px-2.5 py-1 font-heading text-xs font-semibold transition ${
            loc === locale
              ? "bg-brand-navy text-white"
              : "text-brand-navy/60 hover:text-brand-navy"
          }`}
          aria-current={loc === locale}
        >
          {LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
