import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { blogImageUrl, getBlogPosts } from "@/lib/data";
import PageHero from "@/components/PageHero";

export default async function BlogIndexPage(props: PageProps<"/[locale]/blog">) {
  const { locale } = (await props.params) as { locale: Locale };
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const posts = getBlogPosts(locale);

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-2xl bg-brand-grey-light"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {post.image && (
                  <Image
                    src={blogImageUrl(post.image)}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                <h2 className="font-heading text-base font-bold text-brand-navy">
                  {post.title}
                </h2>
                <span className="mt-3 inline-block font-heading text-xs font-semibold uppercase tracking-wide text-brand-navy/60">
                  {tc("readMore")} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
