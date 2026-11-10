"use client";

import { useEffect, useRef, useState } from "react";

export default function StatCounter({
  value,
  label,
  suffix = "",
  tone = "light",
}: {
  value: number;
  label: string;
  suffix?: string;
  /** "dark": koyu zemin üzerinde açık renkli sayı */
  tone?: "light" | "dark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const duration = 1500;
        const start = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(Math.round(value * progress));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div
        className={`font-display text-5xl sm:text-7xl ${
          tone === "dark" ? "text-brand-volt" : "text-brand-navy"
        }`}
      >
        {display.toLocaleString("en-US")}
        {suffix}
      </div>
      <div
        className={`mt-2 font-heading text-xs font-bold uppercase tracking-widest ${
          tone === "dark" ? "text-white/70" : "text-brand-grey"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
