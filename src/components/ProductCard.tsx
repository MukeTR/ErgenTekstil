import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/lib/data";
import { productImageUrl } from "@/lib/data";
import ColorSwatches from "./ColorSwatches";
import AddToQuoteButton from "./quote/AddToQuoteButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative overflow-hidden bg-brand-grey-light transition hover:shadow-xl">
      <AddToQuoteButton
        product={{
          slug: product.slug,
          name: product.name,
          image: product.images[0] ?? null,
          category: product.categories[0],
        }}
      />
      <Link href={`/katalog/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-white">
          <Image
            src={productImageUrl(product.images[0])}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          {product.categories[0] && (
            <span className="tag-sport absolute start-2 top-3 bg-brand-ink py-1 font-heading text-[10px] font-bold uppercase tracking-widest text-white">
              {product.categories[0]}
            </span>
          )}
        </div>
        <div className="border-t-2 border-brand-ink p-4 transition-colors group-hover:border-brand-volt">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-navy">
            {product.name}
          </h3>
          {product.colors.length > 0 && (
            <div className="mt-2">
              <ColorSwatches colors={product.colors} colorKeys={product.colorKeys} />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
