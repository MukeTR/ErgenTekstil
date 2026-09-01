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

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey hover:text-brand-navy"
      >
        ← {t("backToBlog")}
      </Link>

      <h1 className="mt-6 font-heading text-3xl font-extrabold text-brand-navy sm:text-4xl">
        {post.title}
      </h1>

      {post.image && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={blogImageUrl(post.image)} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="prose-content mt-10 space-y-5">
        {post.content.map((block, i) =>
          block.tag === "li" ? (
            <ListRun key={i} items={collectListRun(post.content, i)} />
          ) : (
            <p key={i} className="leading-relaxed text-brand-grey">
              {block.text}
            </p>
          )
        )}
      </div>
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
