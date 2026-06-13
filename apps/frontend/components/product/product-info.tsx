"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

import { StarRating } from "@/components/catalog/star-rating";
import { AddToCartDrawer } from "@/components/product/add-to-cart-drawer";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";
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
  const [offersOpen, setOffersOpen] = useState(true);

  const upiOffer = Math.round(product.sellingPrice * 0.75);

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
      <div className="flex flex-col gap-3 rounded-sm bg-white p-4 shadow-sm">
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

        <div>
          <p className="text-sm text-[var(--text-secondary,#878787)]">{product.brand}</p>
          <h1 className="mt-1 text-lg font-normal leading-snug text-[var(--text-primary,#212121)] md:text-xl">
            {product.title}
          </h1>
        </div>

        <StarRating rating={product.rating} size="md" showValue reviewCount={product.reviewCount} />

        <div>
          {product.discountPercent > 0 && (
            <div className="mb-1 flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-base font-semibold text-[var(--success,#388e3c)]">
                ↓ {product.discountPercent}%
              </span>
              <span className="text-sm text-[var(--text-secondary,#878787)]">
                MRP{" "}
                <span className="line-through">{formatPrice(product.mrp)}</span>
              </span>
            </div>
          )}
          <p className="text-3xl font-medium text-[var(--text-primary,#212121)]">
            {formatPrice(product.sellingPrice)}
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--primary,#2874f0)]">
            {formatPrice(upiOffer)} with UPI offer + more
          </p>
        </div>

        <div className="overflow-hidden rounded-sm border border-[var(--border,#e0e0e0)]">
          <button
            type="button"
            onClick={() => setOffersOpen(!offersOpen)}
            className="flex w-full items-center justify-between bg-[var(--primary,#2874f0)] px-4 py-2.5 text-left text-sm font-medium text-white"
          >
            <span>WOW DEAL — Apply offers for maximum savings</span>
            <ChevronDown
              className={cn("size-4 shrink-0 transition-transform", offersOpen && "rotate-180")}
            />
          </button>
          {offersOpen && (
            <div className="space-y-2 border-t border-[var(--border,#e0e0e0)] bg-[var(--surface,#f1f3f6)] px-4 py-3 text-sm">
              <p className="font-medium text-[var(--text-primary,#212121)]">
                Buy at {formatPrice(upiOffer)}
              </p>
              <p className="text-[var(--text-secondary,#878787)]">
                • 10% instant discount on Axis Bank Credit Cards
              </p>
              <p className="text-[var(--text-secondary,#878787)]">
                • No cost EMI from ₹{Math.round(product.sellingPrice / 6)}/month
              </p>
            </div>
          )}
        </div>

        <p className={cn("text-sm font-medium", stock.className)}>{stock.text}</p>

        {addToCart.isError && (
          <p className="text-sm text-[var(--danger,#d32f2f)]">{addToCart.error.message}</p>
        )}

        <div className="sticky bottom-0 -mx-4 flex gap-0 border-t border-[var(--border,#e0e0e0)] bg-white px-4 py-3 md:static md:mx-0 md:border-0 md:p-0">
          <Button
            type="button"
            onClick={() => void handleAddToCart()}
            disabled={!product.inStock || addToCart.isPending}
            variant="outline"
            className="h-12 flex-1 rounded-none rounded-l-sm border-[var(--border,#e0e0e0)] text-sm font-semibold uppercase shadow-none hover:bg-[var(--surface,#f1f3f6)] disabled:opacity-50 md:rounded-sm md:flex-none md:px-10"
          >
            Add to cart
          </Button>
          <Button
            type="button"
            onClick={() => void handleBuyNow()}
            disabled={!product.inStock || addToCart.isPending}
            className="h-12 flex-1 rounded-none rounded-r-sm bg-[var(--accent,#ffe500)] text-sm font-semibold text-[var(--text-primary,#212121)] shadow-none hover:bg-[#f5d800] disabled:opacity-50 md:rounded-sm md:flex-none md:px-10"
          >
            Buy at {formatPrice(product.sellingPrice)}
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
