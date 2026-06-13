"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { useToggleWishlist } from "@/hooks/use-wishlist";
import { formatDiscount, formatPrice } from "@/lib/format";
import type { WishlistItem } from "@/lib/wishlist-api";

type WishlistItemRowProps = {
  item: WishlistItem;
};

export function WishlistItemRow({ item }: WishlistItemRowProps) {
  const toggleWishlist = useToggleWishlist();
  const { product } = item;
  const image = product.images[0] ?? "/placeholder-product.png";

  return (
    <article className="flex items-start gap-4 border-b border-[var(--border,#e0e0e0)] bg-white px-4 py-4 last:border-b-0">
      <Link href={`/p/${product.slug}`} className="relative shrink-0">
        <div className="relative size-20 overflow-hidden rounded-sm border border-[var(--border,#e0e0e0)] bg-white">
          <Image src={image} alt={product.title} fill sizes="80px" className="object-contain p-1" />
        </div>
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/p/${product.slug}`}
          className="line-clamp-2 text-sm font-medium text-[var(--text-primary,#212121)] hover:text-[var(--primary,#2874f0)]"
        >
          {product.title}
        </Link>
        <p className="mt-0.5 text-xs text-[var(--text-secondary,#878787)]">{product.brand}</p>

        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-base font-semibold text-[var(--text-primary,#212121)]">
            {formatPrice(product.sellingPrice)}
          </span>
          {product.discountPercent > 0 && (
            <>
              <span className="text-xs text-[var(--text-secondary,#878787)] line-through">
                {formatPrice(product.mrp)}
              </span>
              <span className="text-xs font-medium text-[var(--success,#388e3c)]">
                {formatDiscount(product.mrp, product.sellingPrice)}
              </span>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => toggleWishlist.mutate({ productId: product.id, isInWishlist: true })}
        disabled={toggleWishlist.isPending}
        aria-label="Remove from wishlist"
        className="shrink-0 rounded p-2 text-[var(--text-secondary,#878787)] hover:bg-[var(--surface,#f1f3f6)] hover:text-[var(--danger,#d32f2f)] disabled:opacity-50"
      >
        <Trash2 className="size-4" />
      </button>
    </article>
  );
}
