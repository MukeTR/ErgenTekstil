import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getBlogPosts } from "@/lib/data";
import PageHero from "@/components/PageHero";
import BlogGrid from "@/components/BlogGrid";

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
        <BlogGrid
          posts={posts}
          readMoreLabel={tc("readMore")}
          loadMoreLabel={tc("loadMore")}
        />
      </section>
    </>
  );
}
