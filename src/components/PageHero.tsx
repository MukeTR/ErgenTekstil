import Image from "next/image";

export default function PageHero({
  title,
  subtitle,
  image = "/images/factory-floor.webp",
}: {
  title: string;
  subtitle?: string;
  /** Arka plan fotoğrafı; null verilirse düz lacivert */
  image?: string | null;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-navy py-20 text-white sm:py-28">
      {image && (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/85 to-brand-navy/50" />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-extrabold sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-white/75">{subtitle}</p>}
      </div>
    </section>
  );
}
