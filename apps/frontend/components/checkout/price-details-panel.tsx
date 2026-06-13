"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

import { formatPaise } from "@/lib/format";
import { calculateOrderFees } from "@/lib/order-api";
import type { CartSummary } from "@/lib/cart-api";

type PriceDetailsPanelProps = {
  summary: CartSummary;
  undeliverableCount: number;
  onContinue: () => void;
  isProcessing?: boolean;
};

export function PriceDetailsPanel({
  summary,
  undeliverableCount,
  onContinue,
  isProcessing = false,
}: PriceDetailsPanelProps) {
  const [feesOpen, setFeesOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fees = calculateOrderFees(summary.total);
  const totalFees = fees.deliveryFee + fees.platformFee;
  const grandTotal = summary.total + totalFees;
  const canContinue = undeliverableCount === 0 && summary.itemCount > 0;

  return (
    <aside className="sticky top-4 overflow-hidden rounded-sm border border-[var(--border,#e0e0e0)] bg-white">
      <h2 className="border-b border-[var(--border,#e0e0e0)] px-4 py-3 text-sm font-medium text-[var(--text-secondary,#878787)]">
        PRICE DETAILS
      </h2>

      <dl className="space-y-3 px-4 py-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-[var(--text-secondary,#878787)]">
            MRP (Incl. of all taxes) ({summary.itemCount}{" "}
            {summary.itemCount === 1 ? "item" : "items"})
          </dt>
          <dd>{formatPaise(summary.mrpTotal)}</dd>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setFeesOpen((current) => !current)}
            className="flex w-full items-center justify-between text-[var(--text-secondary,#878787)]"
          >
            <span className="flex items-center gap-1">
              Fees
              {feesOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </span>
            <span>{formatPaise(totalFees)}</span>
          </button>
          {feesOpen && (
            <div className="mt-2 space-y-1 pl-3 text-xs text-[var(--text-secondary,#878787)]">
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{fees.deliveryFee === 0 ? "FREE" : formatPaise(fees.deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform / handling</span>
                <span>{formatPaise(fees.platformFee)}</span>
              </div>
            </div>
          )}
        </div>

        {summary.discount > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setDiscountOpen((current) => !current)}
              className="flex w-full items-center justify-between text-[var(--success,#388e3c)]"
            >
              <span className="flex items-center gap-1">
                Discounts
                {discountOpen ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </span>
              <span>- {formatPaise(summary.discount)}</span>
            </button>
            {discountOpen && (
              <p className="mt-1 pl-3 text-xs text-[var(--text-secondary,#878787)]">
                Product discounts applied on MRP
              </p>
            )}
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
        <p className="mx-4 mb-4 rounded-sm bg-[var(--success,#388e3c)]/10 px-3 py-2 text-sm font-medium text-[var(--success,#388e3c)]">
          You will save {formatPaise(summary.discount)} on this order
        </p>
      )}

      <div className="mx-4 mb-4 flex items-start gap-2 text-xs text-[var(--text-secondary,#878787)]">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--success,#388e3c)]" />
        <p>Safe and secure payments. Easy returns. 100% Authentic products.</p>
      </div>

      <div className="border-t border-[var(--border,#e0e0e0)] px-4 py-4">
        <div className="mb-3 flex items-end justify-between">
          <span className="text-xs text-[var(--text-secondary,#878787)] line-through">
            {formatPaise(summary.mrpTotal + totalFees)}
          </span>
          <span className="text-lg font-semibold">{formatPaise(grandTotal)}</span>
        </div>

        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue || isProcessing}
          className={`flex h-12 w-full items-center justify-center rounded-sm text-base font-semibold ${
            canContinue
              ? "bg-[var(--accent,#ffe500)] text-[var(--text-primary,#212121)] hover:bg-[#f5d800]"
              : "cursor-not-allowed bg-[var(--border,#e0e0e0)] text-[var(--text-secondary,#878787)]"
          }`}
        >
          {isProcessing ? "Processing..." : "Continue"}
        </button>

        <button
          type="button"
          onClick={() => setDetailsOpen((current) => !current)}
          className="mt-3 w-full text-center text-xs font-medium text-[var(--primary,#2874f0)] hover:underline"
        >
          {detailsOpen ? "Hide price details" : "View price details"}
        </button>

        {detailsOpen && (
          <div className="mt-3 space-y-2 rounded-sm bg-[var(--surface,#f1f3f6)] p-3 text-xs text-[var(--text-secondary,#878787)]">
            <div className="flex justify-between">
              <span>Items total</span>
              <span>{formatPaise(summary.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span>{fees.deliveryFee === 0 ? "FREE" : formatPaise(fees.deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform fee</span>
              <span>{formatPaise(fees.platformFee)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[var(--text-primary,#212121)]">
              <span>Payable</span>
              <span>{formatPaise(grandTotal)}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
