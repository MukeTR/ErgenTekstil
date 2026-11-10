"use client";

import { useEffect, useRef } from "react";

/** Sessiz döngü videosu: yalnızca ekrandayken oynar (mobilde veri ve pil harcamasın). */
export default function AutoVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video ref={ref} muted loop playsInline preload="metadata" poster={poster} className={className}>
      <source src={src} type="video/mp4" />
    </video>
  );
}
