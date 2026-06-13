"use client";

import type { CartItem } from "@/lib/cart-api";

import { CartItemRow } from "./cart-item";

type CartItemListProps = {
  items: CartItem[];
};

export function CartItemList({ items }: CartItemListProps) {
  return (
    <section className="overflow-hidden rounded-sm border border-[var(--border,#e0e0e0)] bg-white">
      <div className="border-b border-[var(--border,#e0e0e0)] px-4 py-3 text-sm">
        <span className="text-[var(--text-secondary,#878787)]">Deliver to: </span>
        <span className="font-medium text-[var(--text-primary,#212121)]">
          Hyderabad - 500019
        </span>
        <button type="button" className="ml-2 text-[var(--primary,#2874f0)] hover:underline">
          Change
        </button>
      </div>

      {items.map((item) => (
        <CartItemRow key={item.id} item={item} />
      ))}
    </section>
  );
}
