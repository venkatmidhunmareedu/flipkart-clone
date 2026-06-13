"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Minus, Plus } from "lucide-react";

import { StarRating } from "@/components/catalog/star-rating";
import { useRemoveFromCart, useUpdateQuantity } from "@/hooks/use-cart";
import { useAddToWishlist } from "@/hooks/use-wishlist";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/lib/cart-api";

type CartItemRowProps = {
  item: CartItem;
};

function deliveryEstimate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function CartItemRow({ item }: CartItemRowProps) {
  const router = useRouter();
  const updateQuantity = useUpdateQuantity();
  const removeFromCart = useRemoveFromCart();
  const addToWishlist = useAddToWishlist();
  const { product, quantity } = item;

  const upiOffer = Math.round(product.sellingPrice * 0.75);
  const isUpdating =
    updateQuantity.isPending || removeFromCart.isPending || addToWishlist.isPending;

  async function handleSaveForLater() {
    try {
      await addToWishlist.mutateAsync(product.id);
      await removeFromCart.mutateAsync(product.id);
    } catch {
      // errors surfaced via mutation state if needed
    }
  }

  function handleDecrease() {
    if (quantity <= 1) {
      if (window.confirm("Remove this item from your cart?")) {
        removeFromCart.mutate(product.id);
      }
      return;
    }
    updateQuantity.mutate({ productId: product.id, quantity: quantity - 1 });
  }

  function handleIncrease() {
    if (quantity >= product.stock) {
      return;
    }
    updateQuantity.mutate({ productId: product.id, quantity: quantity + 1 });
  }

  return (
    <article className="border-b border-[var(--border,#e0e0e0)] px-4 py-5 last:border-b-0">
      {product.discountPercent >= 20 && (
        <span className="mb-2 inline-block rounded-sm border border-[var(--success,#388e3c)] px-2 py-0.5 text-[10px] font-semibold text-[var(--success,#388e3c)]">
          Hot Deal
        </span>
      )}

      <div className="flex gap-4">
        <div className="shrink-0">
          <Link href={`/p/${product.slug}`} className="relative block">
            <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-sm border border-[var(--border,#e0e0e0)] bg-white">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  width={80}
                  height={80}
                  loading="lazy"
                  className="size-full object-contain p-1"
                />
              ) : (
                <span className="text-[10px] text-[var(--text-secondary,#878787)]">No image</span>
              )}
            </div>
          </Link>

          <div className="relative mt-2">
            <button
              type="button"
              disabled={isUpdating}
              className="flex items-center gap-1 rounded-sm border border-[var(--border,#e0e0e0)] px-2 py-1 text-xs font-medium disabled:opacity-50"
            >
              Qty: {quantity}
              <ChevronDown className="size-3" />
            </button>
            <div className="mt-1 flex overflow-hidden rounded-sm border border-[var(--border,#e0e0e0)]">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={isUpdating}
                className="flex size-7 items-center justify-center hover:bg-[var(--surface,#f1f3f6)] disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Minus className="size-3" />
              </button>
              <button
                type="button"
                onClick={handleIncrease}
                disabled={isUpdating || quantity >= product.stock}
                className="flex size-7 items-center justify-center border-l border-[var(--border,#e0e0e0)] hover:bg-[var(--surface,#f1f3f6)] disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus className="size-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <Link
            href={`/p/${product.slug}`}
            className="line-clamp-2 text-sm font-medium text-[var(--text-primary,#212121)] hover:text-[var(--primary,#2874f0)]"
          >
            {product.title}
          </Link>
          <p className="mt-0.5 text-xs text-[var(--text-secondary,#878787)]">{product.brand}</p>
          <div className="mt-1">
            <StarRating rating={product.rating} size="sm" showValue reviewCount={product.reviewCount} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-[var(--text-primary,#212121)]">
              {formatPrice(product.sellingPrice)}
            </span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-xs text-[var(--text-secondary,#878787)] line-through">
                  {formatPrice(product.mrp)}
                </span>
                <span className="text-xs font-semibold text-[var(--success,#388e3c)]">
                  ↓{product.discountPercent}%
                </span>
              </>
            )}
          </div>

          <p className="mt-1 text-xs font-medium text-[var(--primary,#2874f0)]">
            {formatPrice(upiOffer)} with UPI offer
          </p>

          <p className="mt-2 text-xs text-[var(--text-secondary,#878787)]">
            Delivery by {deliveryEstimate()}
          </p>

          <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-[var(--text-secondary,#878787)]">
            <button
              type="button"
              onClick={() => void handleSaveForLater()}
              disabled={isUpdating}
              className="hover:text-[var(--primary,#2874f0)] disabled:opacity-50"
            >
              {addToWishlist.isPending ? "Saving..." : "Save for later"}
            </button>
            <button
              type="button"
              onClick={() => removeFromCart.mutate(product.id)}
              disabled={isUpdating}
              className="hover:text-[var(--primary,#2874f0)] disabled:opacity-50"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={() => router.push(`/checkout?direct=${product.id}`)}
              className="hover:text-[var(--primary,#2874f0)]"
            >
              Buy this now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
