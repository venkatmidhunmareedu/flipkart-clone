"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { formatPaise } from "@/lib/format";
import type { CartSummary } from "@/lib/cart-api";

type CartSummaryProps = {
  summary: CartSummary;
};

export function CartSummaryPanel({ summary }: CartSummaryProps) {
  const deliveryFee = summary.total >= 50000 ? 0 : 4000;

  return (
    <aside className="sticky top-4 overflow-hidden rounded-sm border border-[var(--border,#e0e0e0)] bg-white">
      <h2 className="border-b border-[var(--border,#e0e0e0)] px-4 py-3 text-sm font-medium text-[var(--text-secondary,#878787)]">
        PRICE DETAILS
      </h2>

      <dl className="space-y-3 px-4 py-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-[var(--text-secondary,#878787)]">
            Price ({summary.itemCount} {summary.itemCount === 1 ? "item" : "items"})
          </dt>
          <dd>{formatPaise(summary.mrpTotal)}</dd>
        </div>
        <div className="flex justify-between text-[var(--success,#388e3c)]">
          <dt>Discount</dt>
          <dd>- {formatPaise(summary.discount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--text-secondary,#878787)]">Delivery Fee</dt>
          <dd>
            {deliveryFee === 0 ? (
              <span className="text-[var(--success,#388e3c)]">FREE</span>
            ) : (
              formatPaise(deliveryFee)
            )}
          </dd>
        </div>
        <div className="border-t border-[var(--border,#e0e0e0)] pt-3">
          <div className="flex justify-between text-base font-semibold">
            <dt>Total Amount</dt>
            <dd>{formatPaise(summary.total + deliveryFee)}</dd>
          </div>
        </div>
      </dl>

      {summary.discount > 0 && (
        <p className="mx-4 mb-4 rounded-sm bg-[var(--success,#388e3c)]/10 px-3 py-2 text-sm font-medium text-[var(--success,#388e3c)]">
          You will save {formatPaise(summary.discount)} on this order
        </p>
      )}

      <div className="mx-4 mb-4 flex items-start gap-2 text-xs text-[var(--text-secondary,#878787)]">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--success,#388e3c)]" />
        <p>
          Safe and secure payments. Easy returns. 100% Authentic products.
        </p>
      </div>

      <div className="border-t border-[var(--border,#e0e0e0)] px-4 py-4">
        <Link
          href="/checkout"
          className="flex h-12 w-full items-center justify-center rounded-sm bg-[var(--accent,#ffe500)] text-base font-semibold text-[var(--text-primary,#212121)] hover:bg-[#f5d800]"
        >
          Place Order
        </Link>
      </div>
    </aside>
  );
}
