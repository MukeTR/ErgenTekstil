export default function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-brand-navy py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-white/70">{subtitle}</p>}
      </div>
    </section>
  );
}
