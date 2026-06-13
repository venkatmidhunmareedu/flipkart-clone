"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { CartItemList } from "@/components/cart/cart-item-list";
import { CartSummaryPanel } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { ProductCarousel } from "@/components/home/product-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const { status } = useSession();
  const { data: cart, isLoading, isError, error } = useCart();

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Skeleton className="h-8 w-40" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <Skeleton className="h-96" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <EmptyCart />
        <div className="mt-6">
          <ProductCarousel title="Suggested for You" products={[]} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <p className="text-sm text-[var(--danger,#d32f2f)]">
          {error instanceof Error ? error.message : "Failed to load cart"}
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="rounded-sm bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-[var(--text-secondary,#878787)]">Your cart is empty.</p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <CartItemList items={cart.items} />
        <CartSummaryPanel summary={cart.summary} />
      </div>
    </div>
  );
}
