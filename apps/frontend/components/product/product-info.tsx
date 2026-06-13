"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

import { StarRating } from "@/components/catalog/star-rating";
import { AddToCartDrawer } from "@/components/product/add-to-cart-drawer";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-cart";
import { formatDiscount, formatPrice } from "@/lib/format";
import type { BreadcrumbItem, Product } from "@/lib/api";
import { cn } from "@/lib/utils";

type ProductInfoProps = {
  product: Product;
  breadcrumb: BreadcrumbItem[];
};

export function ProductInfo({ product, breadcrumb }: ProductInfoProps) {
  const router = useRouter();
  const { status } = useSession();
  const addToCart = useAddToCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [offersOpen, setOffersOpen] = useState(false);

  const upiCashback = Math.round(product.sellingPrice * 0.05);

  function stockLabel() {
    if (!product.inStock) return { text: "Out of Stock", className: "text-[var(--danger,#d32f2f)]" };
    if (product.stock <= 5)
      return { text: `Only ${product.stock} left`, className: "text-[var(--danger,#d32f2f)]" };
    return { text: "In Stock", className: "text-[var(--success,#388e3c)]" };
  }

  const stock = stockLabel();

  async function handleAddToCart() {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/p/${product.slug}`);
      return;
    }

    try {
      await addToCart.mutateAsync({ productId: product.id });
      setDrawerOpen(true);
    } catch {
      // mutation error surfaced via isError if needed
    }
  }

  async function handleBuyNow() {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/p/${product.slug}`);
      return;
    }

    try {
      await addToCart.mutateAsync({ productId: product.id });
      router.push("/cart");
    } catch {
      // ignore
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <nav className="flex flex-wrap items-center gap-1 text-xs text-[var(--text-secondary,#878787)]">
          <Link href="/" className="hover:text-[var(--primary,#2874f0)]">
            Home
          </Link>
          {breadcrumb.map((item) => (
            <span key={item.id} className="flex items-center gap-1">
              <ChevronRight className="size-3" />
              <Link
                href={`/category/${item.slug}`}
                className="hover:text-[var(--primary,#2874f0)]"
              >
                {item.name}
              </Link>
            </span>
          ))}
        </nav>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--text-secondary,#878787)]">{product.brand}</p>
            <h1 className="mt-1 text-xl font-medium leading-snug text-[var(--text-primary,#212121)] md:text-2xl">
              {product.title}
            </h1>
          </div>
          <WishlistButton productId={product.id} variant="inline" className="shrink-0" />
        </div>

        <StarRating rating={product.rating} size="md" showValue reviewCount={product.reviewCount} />

        <div className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white p-4">
          {product.discountPercent > 0 && (
            <div className="mb-1 flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-lg font-medium text-[var(--success,#388e3c)]">
                ↓ {product.discountPercent}%
              </span>
              <span className="text-sm text-[var(--text-secondary,#878787)] line-through">
                {formatPrice(product.mrp)}
              </span>
            </div>
          )}
          <p className="text-3xl font-semibold text-[var(--text-primary,#212121)]">
            {formatPrice(product.sellingPrice)}
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary,#878787)]">
            {formatDiscount(product.mrp, product.sellingPrice)} · UPI cashback up to{" "}
            {formatPrice(upiCashback)}
          </p>
        </div>

        <div className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white">
          <button
            type="button"
            onClick={() => setOffersOpen(!offersOpen)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
          >
            <span>WOW DEAL — Apply offers for maximum savings</span>
            <ChevronDown
              className={cn("size-4 transition-transform", offersOpen && "rotate-180")}
            />
          </button>
          {offersOpen && (
            <div className="border-t border-[var(--border,#e0e0e0)] px-4 py-3 text-sm text-[var(--text-secondary,#878787)]">
              <p>• 10% instant discount on Axis Bank Credit Cards</p>
              <p className="mt-1">• No cost EMI from ₹{Math.round(product.sellingPrice / 6)}/month</p>
              <p className="mt-1">• Exchange offer up to {formatPrice(Math.round(product.mrp * 0.1))}</p>
            </div>
          )}
        </div>

        <p className={cn("text-sm font-medium", stock.className)}>{stock.text}</p>

        {addToCart.isError && (
          <p className="text-sm text-[var(--danger,#d32f2f)]">{addToCart.error.message}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => void handleAddToCart()}
            disabled={!product.inStock || addToCart.isPending}
            className="h-12 flex-1 rounded-sm bg-[var(--accent,#ffe500)] text-base font-semibold text-[var(--text-primary,#212121)] hover:bg-[#f5d800] disabled:opacity-50 sm:flex-none sm:px-10"
          >
            ADD TO CART
          </Button>
          <Button
            type="button"
            onClick={() => void handleBuyNow()}
            disabled={!product.inStock || addToCart.isPending}
            className="h-12 flex-1 rounded-sm bg-[var(--primary,#2874f0)] text-base font-semibold text-white hover:bg-[var(--primary-dark,#1a5fd1)] disabled:opacity-50 sm:flex-none sm:px-10"
          >
            BUY NOW
          </Button>
        </div>
      </div>

      <AddToCartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        productTitle={product.title}
      />
    </>
  );
}
