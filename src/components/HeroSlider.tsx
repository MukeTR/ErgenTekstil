"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export type HeroSlide = {
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
    <section className="relative overflow-hidden bg-brand-navy text-white">
      {/* Aktif arka plan: örgü makinesi videosu */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/factory-floor.webp"
        src="/video/hero.mp4"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/70 to-brand-navy/40" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-navy/80 to-transparent" />

      <div className="relative mx-auto grid min-h-[85vh] max-w-[96rem] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.6fr] lg:gap-12 lg:px-10">
        <div key={`text-${active}`} className="hero-fade">
          <h1 className="font-heading text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
            {slide.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/katalog"
              className="rounded-full bg-white px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-white/90"
            >
              {allProductsLabel}
            </Link>
            <Link
              href="/iletisim"
              className="rounded-full border border-white/40 px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
            >
              {requestQuoteLabel}
            </Link>
          </div>
        </div>

        <div>
          <div key={`grid-${active}`} className="hero-fade grid grid-cols-3 gap-4 sm:gap-5">
            {slide.images.map((src, i) => (
              <div
                key={`${active}-${i}`}
                className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-white/10 shadow-2xl ring-1 ring-white/15 ${
                  i === 1 ? "lg:-translate-y-6" : ""
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 30vw, 26vw"
                  className="object-cover"
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
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              ‹
            </button>
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === active ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => setActive((i) => (i + 1) % slides.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
