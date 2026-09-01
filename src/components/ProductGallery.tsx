"use client";

import { useState } from "react";
import Image from "next/image";
import { productImageUrl } from "@/lib/data";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-grey-light">
        <Image
          src={productImageUrl(images[active])}
          alt={name}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-6 gap-2">
          {images.slice(0, 12).map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                i === active ? "border-brand-navy" : "border-transparent"
              }`}
            >
              <Image src={productImageUrl(img)} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
