import Image from "next/image";

export default function PageHero({
  title,
  subtitle,
  image = "/images/factory-floor.webp",
}: {
  title: string;
  subtitle?: string;
  /** Arka plan fotoğrafı; null verilirse düz koyu zemin */
  image?: string | null;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-ink text-white">
      {image && (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/85 to-brand-ink/40" />
        </>
      )}
      <div className="ink-texture absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
        <span className="tag-sport bg-brand-volt py-1 font-heading text-[11px] font-bold uppercase tracking-widest text-brand-ink">
          Ergen Tekstil
        </span>
        <h1 className="mt-5 max-w-4xl text-5xl sm:text-7xl">{title}</h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
      {/* Alt kenar: çapraz şerit bant */}
      <div className="stripes absolute inset-x-0 bottom-0 h-2.5" />
    </section>
  );
}
