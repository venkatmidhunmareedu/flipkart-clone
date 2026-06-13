"use client";

import Image from "next/image";
import { Share2 } from "lucide-react";
import { useState } from "react";

import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { cn } from "@/lib/utils";

type ProductImageGalleryProps = {
  images: string[];
  title: string;
  productId: string;
};

export function ProductImageGallery({ images, title, productId }: ProductImageGalleryProps) {
  const gallery = images.length > 0 ? images : ["/placeholder-product.png"];
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="rounded-sm bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
          {gallery.slice(0, 5).map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative size-14 shrink-0 overflow-hidden rounded-sm border bg-white sm:size-16",
                selectedIndex === index
                  ? "border-[var(--primary,#2874f0)]"
                  : "border-[var(--border,#e0e0e0)] hover:border-[var(--primary,#2874f0)]/50",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="64px"
                loading="lazy"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>

        <div className="relative order-1 flex-1 sm:order-2">
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
            <WishlistButton productId={productId} />
            <button
              type="button"
              aria-label="Share product"
              className="flex size-9 items-center justify-center rounded-full border border-[var(--border,#e0e0e0)] bg-white text-[var(--text-secondary,#878787)] hover:text-[var(--primary,#2874f0)]"
            >
              <Share2 className="size-4" />
            </button>
          </div>
          <div className="relative aspect-square w-full max-h-[420px]">
            <Image
              src={gallery[selectedIndex] ?? gallery[0]}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              priority
              className="object-contain p-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
