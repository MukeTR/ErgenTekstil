"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export type HeroSlide = {
  kicker: string;
  title: string;
  subtitle: string;
  images: [string, string, string];
};

export default function HeroSlider({
  slides,
  allProductsLabel,
  requestQuoteLabel,
}: {
  slides: HeroSlide[];
  allProductsLabel: string;
  requestQuoteLabel: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[active];

  return (
    <section className="relative overflow-hidden bg-brand-ink text-white">
      {/* Arka plan: örgü makinesi videosu */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/factory-floor.webp"
        src="/video/hero.mp4"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/85 to-brand-ink/50" />
      <div className="ink-texture absolute inset-0" />

      <div className="relative mx-auto grid min-h-[88vh] max-w-[96rem] items-center gap-10 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1fr_1.25fr] lg:gap-8 lg:px-10">
        <div key={`text-${active}`} className="hero-fade">
          <span className="tag-sport bg-brand-volt py-1 font-heading text-[11px] font-bold uppercase tracking-widest text-brand-ink">
            {slide.kicker}
          </span>
          <h1 className="mt-6 text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem]">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
            {slide.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-4 ps-2">
            <Link
              href="/katalog"
              className="btn-sport bg-brand-volt px-8 py-4 font-heading text-sm font-bold uppercase tracking-wide text-brand-ink transition hover:bg-white"
            >
              {allProductsLabel}
            </Link>
            <Link
              href="/iletisim"
              className="btn-sport border-2 border-white/50 px-8 py-[14px] font-heading text-sm font-bold uppercase tracking-wide text-white transition hover:border-brand-volt hover:text-brand-volt"
            >
              {requestQuoteLabel}
            </Link>
          </div>
        </div>

        <div>
          {/* Eğik üç panel: hareket hissi */}
          <div
            key={`grid-${active}`}
            className="hero-fade grid grid-cols-3 gap-3 px-4 sm:gap-4 sm:px-8"
          >
            {slide.images.map((src, i) => (
              <div
                key={`${active}-${i}`}
                className={`relative aspect-[9/16] -skew-x-6 overflow-hidden bg-white/10 shadow-2xl sm:aspect-[3/5] ${
                  i === 1 ? "-translate-y-5 border-b-4 border-brand-volt" : "translate-y-3"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 33vw, 22vw"
                  className="skew-x-6 scale-[1.18] object-cover object-top"
                  priority={active === 0}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-end gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => setActive((i) => (i - 1 + slides.length) % slides.length)}
              className="flex h-10 w-10 -skew-x-6 items-center justify-center border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-brand-volt hover:text-brand-ink"
            >
              ‹
            </button>
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-1.5 -skew-x-12 transition-all ${
                  i === active ? "w-12 bg-brand-volt" : "w-6 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => setActive((i) => (i + 1) % slides.length)}
              className="flex h-10 w-10 -skew-x-6 items-center justify-center border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-brand-volt hover:text-brand-ink"
            >
              ›
            </button>
          </div>
        </div>
      </div>
      <div className="stripes absolute inset-x-0 bottom-0 h-2.5" />
    </section>
  );
}
