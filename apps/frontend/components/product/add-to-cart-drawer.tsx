"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
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
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={cn(
          "fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl",
          "animate-in slide-in-from-right duration-300",
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--border,#e0e0e0)] px-6 py-4">
          <div className="flex items-center gap-2 text-[var(--success,#388e3c)]">
            <CheckCircle2 className="size-5" />
            <span id="cart-drawer-title" className="font-medium">
              Hooray! 1 item added to the cart
            </span>
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

        <div className="flex-1 px-6 py-6">
          <p className="text-sm text-[var(--text-secondary,#878787)]">Added item</p>
          <p className="mt-1 font-medium text-[var(--text-primary,#212121)]">{productTitle}</p>
        </div>

        <div className="border-t border-[var(--border,#e0e0e0)] px-6 py-4">
          <Link
            href="/cart"
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center rounded-sm bg-[var(--primary,#2874f0)] text-base font-semibold text-white hover:bg-[var(--primary-dark,#1a5fd1)]"
          >
            GO TO CART
          </Link>
        </div>
      </div>
    </>
  );
}
