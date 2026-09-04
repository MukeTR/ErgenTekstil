import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/lib/data";
import { productImageUrl } from "@/lib/data";
import ColorSwatches from "./ColorSwatches";
import AddToQuoteButton from "./quote/AddToQuoteButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-brand-grey-light transition hover:shadow-lg">
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
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-heading text-[11px] font-semibold uppercase tracking-wide text-brand-navy">
            {product.categories[0]}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading text-sm font-semibold text-brand-navy">
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
