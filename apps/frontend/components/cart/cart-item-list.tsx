"use client";

import type { CartItem } from "@/lib/cart-api";

import { CartItemRow } from "./cart-item";

type CartItemListProps = {
  items: CartItem[];
};

export function CartItemList({ items }: CartItemListProps) {
  return (
    <section className="overflow-hidden rounded-sm bg-white shadow-sm">
      <div className="flex border-b border-[var(--border,#e0e0e0)]">
        <button
          type="button"
          className="border-b-2 border-[var(--primary,#2874f0)] px-4 py-3 text-sm font-medium text-[var(--primary,#2874f0)]"
        >
          Flipkart ({items.length})
        </button>
        <button
          type="button"
          className="px-4 py-3 text-sm font-medium text-[var(--text-secondary,#878787)]"
        >
          Grocery
        </button>
      </div>

      <div className="border-b border-[var(--border,#e0e0e0)] px-4 py-3 text-sm">
        <span className="text-[var(--text-secondary,#878787)]">Deliver to: </span>
        <span className="font-medium text-[var(--text-primary,#212121)]">
          Hyderabad - 500019
        </span>
        <button
          type="button"
          className="ml-2 rounded-sm border border-[var(--primary,#2874f0)] px-2 py-0.5 text-xs font-medium text-[var(--primary,#2874f0)] hover:bg-[var(--primary,#2874f0)]/5"
        >
          Change
        </button>
      </div>

      {items.map((item) => (
        <CartItemRow key={item.id} item={item} />
      ))}
    </section>
  );
}
