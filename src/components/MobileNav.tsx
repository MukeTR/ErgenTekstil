"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";

export default function MobileNav({
  links,
  locale,
  ctaLabel,
}: {
  links: { href: string; label: string }[];
  locale: Locale;
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`h-0.5 w-6 bg-brand-navy transition ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span className={`h-0.5 w-6 bg-brand-navy transition ${open ? "opacity-0" : ""}`} />
        <span
          className={`h-0.5 w-6 bg-brand-navy transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div className="fixed inset-x-0 top-[65px] bottom-0 z-40 overflow-y-auto bg-white px-6 py-8">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-black/5 py-4 font-heading text-base font-semibold text-brand-navy"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex items-center justify-between gap-4">
            <LanguageSwitcher locale={locale} />
            <Link
              href="/iletisim"
              onClick={() => setOpen(false)}
              className="rounded-full bg-brand-navy px-5 py-2.5 font-heading text-[13px] font-semibold uppercase tracking-wide text-white"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
