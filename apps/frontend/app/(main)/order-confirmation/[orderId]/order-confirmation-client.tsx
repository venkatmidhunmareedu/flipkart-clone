"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { useOrder } from "@/hooks/use-orders";
import { formatPaise, formatPrice } from "@/lib/format";

export default function OrderConfirmationPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;
  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center text-sm text-[var(--text-secondary,#878787)]">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-[var(--danger,#d32f2f)]">
          {error?.message ?? "Order not found"}
        </p>
        <Link href="/" className="mt-4 inline-block text-[var(--primary,#2874f0)] hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto size-16 animate-pulse text-[var(--success,#388e3c)]" />
        <h1 className="mt-4 text-2xl font-semibold text-[var(--text-primary,#212121)]">
          Order Placed Successfully!
        </h1>
        <p className="mt-2 text-lg font-medium text-[var(--primary,#2874f0)]">
          #{order.displayId}
        </p>
        <p className="mt-2 text-sm text-[var(--text-secondary,#878787)]">
          Estimated delivery by {order.estimatedDeliveryLabel}
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-sm border border-[var(--border,#e0e0e0)] bg-white">
        <div className="border-b border-[var(--border,#e0e0e0)] px-4 py-3">
          <h2 className="text-base font-medium">Order Summary</h2>
        </div>
        <div className="divide-y divide-[var(--border,#e0e0e0)]">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-4 py-4">
              <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-sm border border-[var(--border,#e0e0e0)] bg-[var(--surface,#f1f3f6)]">
                {item.product.images[0] ? (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    width={56}
                    height={56}
                    loading="lazy"
                    className="size-full object-contain p-1"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium">{item.product.title}</p>
                <p className="text-xs text-[var(--text-secondary,#878787)]">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold">
                {formatPrice(item.product.sellingPrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t border-[var(--border,#e0e0e0)] px-4 py-4 text-base font-semibold">
          <span>Total Paid</span>
          <span>{formatPaise(order.totalAmount)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-sm bg-[var(--accent,#ffe500)] px-6 py-3 text-sm font-semibold text-[var(--text-primary,#212121)] hover:bg-[#f5d800]"
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="rounded-sm border border-[var(--primary,#2874f0)] px-6 py-3 text-sm font-semibold text-[var(--primary,#2874f0)] hover:bg-[var(--primary,#2874f0)]/5"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}
