"use client";

import Link from "next/link";
import { ChevronDown, ShieldCheck } from "lucide-react";

import { formatPaise } from "@/lib/format";
import type { CartSummary } from "@/lib/cart-api";

type CartSummaryProps = {
  summary: CartSummary;
};

export function CartSummaryPanel({ summary }: CartSummaryProps) {
  const deliveryFee = summary.total >= 50000 ? 0 : 4000;
  const grandTotal = summary.total + deliveryFee;

  return (
    <aside className="sticky top-4 overflow-hidden rounded-sm bg-white shadow-sm">
      <h2 className="border-b border-[var(--border,#e0e0e0)] px-4 py-3 text-xs font-medium uppercase tracking-wide text-[var(--text-secondary,#878787)]">
        Price Details
      </h2>

      <dl className="space-y-3 px-4 py-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-[var(--text-secondary,#878787)]">
            MRP (incl. of all taxes)
          </dt>
          <dd>{formatPaise(summary.mrpTotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="flex items-center gap-1 text-[var(--text-secondary,#878787)]">
            Fees
            <ChevronDown className="size-3.5" />
          </dt>
          <dd>{deliveryFee === 0 ? "FREE" : formatPaise(deliveryFee)}</dd>
        </div>
        {summary.discount > 0 && (
          <div className="flex justify-between text-[var(--success,#388e3c)]">
            <dt className="flex items-center gap-1">
              Discounts
              <ChevronDown className="size-3.5" />
            </dt>
            <dd>- {formatPaise(summary.discount)}</dd>
          </div>
        )}
        <div className="border-t border-[var(--border,#e0e0e0)] pt-3">
          <div className="flex justify-between text-base font-semibold">
            <dt>Total Amount</dt>
            <dd>{formatPaise(grandTotal)}</dd>
          </div>
        </div>
      </dl>

      {summary.discount > 0 && (
        <p className="mx-4 mb-4 rounded-sm bg-[var(--success-light,#e8f5e9)] px-3 py-2 text-sm font-medium text-[var(--success,#388e3c)]">
          You will save {formatPaise(summary.discount)} on this order
        </p>
      )}

      <div className="mx-4 mb-4 flex items-start gap-2 text-xs text-[var(--text-secondary,#878787)]">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--text-secondary,#878787)]" />
        <p>
          Safe and secure payments. Easy returns. 100% Authentic products.
        </p>
      </div>

      <div className="sticky bottom-0 border-t border-[var(--border,#e0e0e0)] bg-white px-4 py-3 md:static">
        <div className="mb-3 hidden items-end justify-between md:flex">
          <span className="text-xs text-[var(--text-secondary,#878787)] line-through">
            {formatPaise(summary.mrpTotal + deliveryFee)}
          </span>
          <span className="text-lg font-semibold">{formatPaise(grandTotal)}</span>
        </div>
        <Link
          href="/checkout"
          className="flex h-12 w-full items-center justify-center rounded-sm bg-[var(--accent,#ffe500)] text-sm font-semibold uppercase tracking-wide text-[var(--text-primary,#212121)] hover:bg-[#f5d800]"
        >
          Place Order
        </Link>
      </div>
    </aside>
  );
}
