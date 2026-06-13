"use client";

import Image from "next/image";
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
  const [zooming, setZooming] = useState(false);

  return (
    <div className="flex gap-4">
      <div className="hidden flex-col gap-2 sm:flex">
        {gallery.slice(0, 5).map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "relative size-16 overflow-hidden rounded-sm border-2 bg-white",
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

      <div
        className="relative flex-1 overflow-hidden rounded-sm bg-white"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
      >
        <WishlistButton
          productId={productId}
          className="absolute top-3 right-3"
        />
        <div className="relative aspect-square max-h-[480px] w-full">
          <Image
            src={gallery[selectedIndex] ?? gallery[0]}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            priority
            className={cn(
              "object-contain p-4 transition-transform duration-300",
              zooming && "scale-125",
            )}
          />
        </div>
      </div>
    </div>
  );
}
