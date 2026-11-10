"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export type StoryChapter = {
  /** Büyük, soluk üst yazı: yıl ya da sıra numarası */
  mark: string;
  title: string;
  text?: string;
  list?: string[];
  image: string;
};

/**
 * Kaydırmalı hikâye: solda sabit duran görsel, sağda akan bölümler. Hangi bölüm
 * ekranın ortasındaysa görsel ona yumuşakça geçer; kenardaki çizgi ilerlemeyi gösterir.
 * Mobilde her bölümün görseli kendi metninin üstünde yer alır.
 */
export default function AboutStory({ chapters }: { chapters: StoryChapter[] }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      // Ekranın orta şeridine giren bölüm etkin olur
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && observer.observe(el));

    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        setProgress(total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0);
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-16">
        {/* Sabit görsel sütunu (masaüstü) */}
        <div className="hidden lg:block">
          <div className="sticky top-24 flex h-[calc(100vh-8rem)] items-center">
            <div className="relative h-[78%] w-full overflow-hidden rounded-3xl bg-brand-navy shadow-2xl">
              {chapters.map((ch, i) => (
                <Image
                  key={ch.image + i}
                  src={ch.image}
                  alt=""
                  fill
                  sizes="50vw"
                  priority={i === 0}
                  className={`object-cover transition-all duration-1000 ease-out ${
                    i === active ? "scale-100 opacity-100" : "scale-110 opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7 text-white">
                <span
                  key={active}
                  className="hero-fade font-heading text-6xl font-extrabold tracking-tight"
                >
                  {chapters[active].mark}
                </span>
                <span className="font-heading text-xs font-semibold tracking-[0.2em] text-white/70">
                  {String(active + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Akan bölümler */}
        <div className="relative">
          {/* İlerleme çizgisi */}
          <div className="absolute inset-y-0 start-0 hidden w-px bg-black/10 lg:block">
            <div
              className="w-px origin-top bg-brand-navy"
              style={{ height: "100%", transform: `scaleY(${progress})` }}
            />
          </div>

          {chapters.map((ch, i) => (
            <section
              key={ch.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className="flex min-h-0 flex-col justify-center py-12 lg:min-h-[86vh] lg:py-0 lg:ps-12"
            >
              <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl lg:hidden">
                <Image src={ch.image} alt="" fill sizes="100vw" className="object-cover" />
              </div>
              <div
                className={`transition-all duration-700 ease-out ${
                  i === active ? "lg:translate-y-0 lg:opacity-100" : "lg:translate-y-4 lg:opacity-30"
                }`}
              >
                <span className="font-heading text-sm font-bold tracking-[0.25em] text-brand-navy/40">
                  {ch.mark}
                </span>
                <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
                  {ch.title}
                </h2>
                {ch.text && (
                  <p className="mt-6 text-lg leading-relaxed text-brand-grey">{ch.text}</p>
                )}
                {ch.list && (
                  <ul className="mt-6 space-y-4">
                    {ch.list.map((item, k) => (
                      <li key={item} className="flex gap-4 text-brand-grey">
                        <span className="font-heading text-sm font-bold text-brand-navy/40">
                          {String(k + 1).padStart(2, "0")}
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
