"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { blogImageUrl } from "@/lib/data";
import type { BlogPost } from "@/lib/data";

const PAGE_SIZE = 12;

export default function BlogGrid({
  posts,
  readMoreLabel,
  loadMoreLabel,
}: {
  posts: BlogPost[];
  readMoreLabel: string;
  loadMoreLabel: string;
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = posts.slice(0, visible);

  return (
    <div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block overflow-hidden rounded-2xl bg-brand-grey-light"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy/5">
              {post.image ? (
                <Image
                  src={blogImageUrl(post.image)}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center font-heading text-sm font-semibold uppercase tracking-wide text-brand-navy/30">
                  {post.code ? `Code ${post.code}` : "Ergen Tekstil"}
                </div>
              )}
            </div>
            <div className="p-5">
              <h2 className="font-heading text-base font-bold text-brand-navy">
                {post.title}
              </h2>
              <span className="mt-3 inline-block font-heading text-xs font-semibold uppercase tracking-wide text-brand-navy/60">
                {readMoreLabel} →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {visible < posts.length && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-full bg-brand-navy px-8 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black"
          >
            {loadMoreLabel}
          </button>
        </div>
      )}
    </div>
  );
}
