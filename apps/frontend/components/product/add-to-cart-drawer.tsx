"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type AddToCartDrawerProps = {
  open: boolean;
  onClose: () => void;
  productTitle: string;
};

export function AddToCartDrawer({ open, onClose, productTitle }: AddToCartDrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => {
      onClose();
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={cn(
          "fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl",
          "animate-in slide-in-from-right duration-300",
        )}
      >
        <div className="flex items-start justify-between border-b border-[var(--border,#e0e0e0)] px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--success,#388e3c)] text-white">
              <Check className="size-5 stroke-[3]" />
            </span>
            <div>
              <p id="cart-drawer-title" className="font-medium text-[var(--text-primary,#212121)]">
                Hooray! 1 item added to the cart
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary,#878787)]">
                {productTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 hover:bg-[var(--surface,#f1f3f6)]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-sm text-[var(--text-secondary,#878787)]">
            Review your cart or continue shopping.
          </p>
        </div>

        <div className="border-t border-[var(--border,#e0e0e0)] px-5 py-4">
          <Link
            href="/cart"
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center rounded-sm bg-[var(--primary,#2874f0)] text-sm font-semibold uppercase tracking-wide text-white hover:bg-[var(--primary-dark,#1a5fd1)]"
          >
            Go to Cart
          </Link>
        </div>
      </div>
    </>
  );
}
