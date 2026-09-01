import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { blogImageUrl, getBlogPost, getBlogPosts } from "@/lib/data";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getBlogPosts(locale).map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/blog/[slug]">
) {
  const { locale, slug } = (await props.params) as { locale: Locale; slug: string };
  const post = getBlogPost(locale, slug);
  return { title: post?.title ?? "Ergen Tekstil" };
}

export default async function BlogPostPage(
  props: PageProps<"/[locale]/blog/[slug]">
) {
  const { locale, slug } = (await props.params) as { locale: Locale; slug: string };
  setRequestLocale(locale);

  const post = getBlogPost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const tp = await getTranslations({ locale, namespace: "product" });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="flex w-fit items-center gap-2 font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey hover:text-brand-navy"
      >
        ← {t("backToBlog")}
      </Link>

      {post.code && (
        <span className="mt-6 inline-block font-heading text-xs font-semibold uppercase tracking-widest text-brand-grey">
          Code {post.code}
        </span>
      )}
      <h1 className="mt-2 font-heading text-3xl font-extrabold text-brand-navy sm:text-4xl">
        {post.title}
      </h1>

      {post.image && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={blogImageUrl(post.image)} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      {post.features ? (
        <>
          {post.features.length > 0 && (
            <div className="mt-10">
              <h2 className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey">
                {tc("features")}
              </h2>
              <ul className="mt-3 space-y-2">
                {post.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-brand-grey">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-10 rounded-2xl bg-brand-grey-light p-6">
            <p className="text-sm text-brand-grey">{tp("quoteIntro")}</p>
            <Link
              href={{ pathname: "/iletisim", query: { urun: post.title } }}
              className="mt-4 inline-block rounded-full bg-brand-navy px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black"
            >
              {tc("requestQuote")}
            </Link>
          </div>
        </>
      ) : (
        <div className="prose-content mt-10 space-y-5">
          {post.content?.map((block, i) =>
            block.tag === "li" ? (
              <ListRun key={i} items={collectListRun(post.content!, i)} />
            ) : (
              <p key={i} className="leading-relaxed text-brand-grey">
                {block.text}
              </p>
            )
          )}
        </div>
      )}
    </article>
  );
}

function collectListRun(
  content: { tag: string; text: string }[],
  startIndex: number
) {
  if (content[startIndex - 1]?.tag === "li") return [];
  const items: string[] = [];
  let i = startIndex;
  while (content[i]?.tag === "li") {
    items.push(content[i].text);
    i++;
  }
  return items;
}

function ListRun({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="space-y-3 rounded-2xl bg-brand-grey-light p-6">
      {items.map((text) => {
        const [label, ...rest] = text.split(":");
        const detail = rest.join(":").trim();
        return (
          <li key={text} className="flex gap-3 text-brand-grey">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy" />
            <span>
              {detail ? (
                <>
                  <strong className="text-brand-navy">{label}:</strong> {detail}
                </>
              ) : (
                text
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
