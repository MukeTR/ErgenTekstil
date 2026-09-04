"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LANGUAGES: Record<Locale, { flag: string; code: string; name: string }> = {
  tr: { flag: "🇹🇷", code: "TR", name: "Türkçe" },
  en: { flag: "🇬🇧", code: "EN", name: "English" },
  ar: { flag: "🇸🇦", code: "AR", name: "العربية" },
  de: { flag: "🇩🇪", code: "DE", name: "Deutsch" },
  ru: { flag: "🇷🇺", code: "RU", name: "Русский" },
};

export default function LanguageSwitcher({
  locale,
  /** Mobil menüde yukarı değil aşağı açılır ve tam genişlik kullanır */
  variant = "desktop",
}: {
  locale: Locale;
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES[locale];

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function select(loc: Locale) {
    setOpen(false);
    if (loc !== locale) router.replace(pathname, { locale: loc });
  }

  return (
    <div ref={ref} className={`relative ${variant === "mobile" ? "w-full" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 font-heading text-xs font-semibold text-brand-navy transition hover:border-brand-navy/40 ${
          variant === "mobile" ? "w-full justify-between" : ""
        }`}
      >
        <span className="flex items-center gap-2">
          <span className="text-base leading-none" aria-hidden="true">
            {current.flag}
          </span>
          <span>{variant === "mobile" ? current.name : current.code}</span>
        </span>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-3.5 w-3.5 fill-current transition ${open ? "rotate-180" : ""}`}
        >
          <path d="M5.5 7.5 10 12l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className={`absolute z-50 mt-2 min-w-[11rem] overflow-hidden rounded-2xl border border-black/5 bg-white py-1.5 shadow-xl ${
            variant === "mobile" ? "start-0 w-full" : "end-0"
          }`}
        >
          {routing.locales.map((loc) => {
            const lang = LANGUAGES[loc];
            const active = loc === locale;
            return (
              <li key={loc}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => select(loc)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm transition ${
                    active
                      ? "bg-brand-grey-light font-semibold text-brand-navy"
                      : "text-brand-navy/80 hover:bg-brand-grey-light hover:text-brand-navy"
                  }`}
                >
                  <span className="text-lg leading-none" aria-hidden="true">
                    {lang.flag}
                  </span>
                  <span className="flex-1">{lang.name}</span>
                  <span className="font-heading text-[11px] font-semibold text-brand-navy/50">
                    {lang.code}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
