"use client";

import Link from "next/link";

import { useWishlist } from "@/hooks/use-wishlist";

import { WishlistItemRow } from "./wishlist-item";

export function WishlistPanel() {
  const { data: items, isLoading, isError, error } = useWishlist();

  if (isLoading) {
    return (
      <div className="flex-1 rounded-sm bg-white p-6 shadow-sm">
        <div className="h-6 w-48 animate-pulse rounded bg-[var(--surface,#f1f3f6)]" />
        <div className="mt-4 space-y-4">
          {[1, 2, 3].map((key) => (
            <div key={key} className="h-24 animate-pulse rounded bg-[var(--surface,#f1f3f6)]" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 rounded-sm bg-white p-6 shadow-sm">
        <p className="text-sm text-[var(--danger,#d32f2f)]">{error.message}</p>
      </div>
    );
  }

  const wishlistItems = items ?? [];

  return (
    <div className="min-w-0 flex-1 rounded-sm bg-white shadow-sm">
      <div className="border-b border-[var(--border,#e0e0e0)] px-4 py-4">
        <h1 className="text-lg font-medium text-[var(--text-primary,#212121)]">
          My Wishlist ({wishlistItems.length})
        </h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p className="text-[var(--text-secondary,#878787)]">
            Your wishlist is empty — Start adding items you love
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          {wishlistItems.map((item) => (
            <WishlistItemRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
