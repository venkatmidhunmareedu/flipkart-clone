"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";

import { useOrder } from "@/hooks/use-orders";
import { formatPaise, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

const ORDER_STEPS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "text-gray-600",
  CONFIRMED: "text-blue-600",
  SHIPPED: "text-orange-600",
  DELIVERED: "text-green-600",
  CANCELLED: "text-red-600",
};

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const { data: order, isLoading, isError, error } = useOrder(id);

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-sm bg-white" />;
  }

  if (isError || !order) {
    return (
      <div className="rounded-sm bg-white p-6 shadow-sm">
        <p className="text-sm text-[var(--danger,#d32f2f)]">
          {error?.message ?? "Order not found"}
        </p>
        <Link href="/account/orders" className="mt-4 inline-block text-sm text-[var(--primary,#2874f0)]">
          Back to orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.indexOf(
    order.status as (typeof ORDER_STEPS)[number],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-medium text-[var(--text-primary,#212121)]">
            Order {order.displayId}
          </h1>
          <p className="text-sm text-[var(--text-secondary,#878787)]">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Link href="/account/orders" className="text-sm text-[var(--primary,#2874f0)] hover:underline">
          ← Back to orders
        </Link>
      </div>

      {order.status !== "CANCELLED" && (
        <section className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-medium text-[var(--text-primary,#212121)]">
            Order Status
          </h2>
          <div className="flex items-center justify-between">
            {ORDER_STEPS.map((step, index) => {
              const isComplete = currentStepIndex >= index;
              const isCurrent = order.status === step;

              return (
                <div key={step} className="flex flex-1 flex-col items-center">
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full text-xs font-semibold",
                      isComplete
                        ? "bg-[var(--primary,#2874f0)] text-white"
                        : "bg-[var(--surface,#f1f3f6)] text-[var(--text-secondary,#878787)]",
                      isCurrent && "ring-2 ring-[var(--primary,#2874f0)]/30",
                    )}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-[10px] font-medium uppercase",
                      isComplete
                        ? "text-[var(--primary,#2874f0)]"
                        : "text-[var(--text-secondary,#878787)]",
                    )}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {order.address && (
        <section className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-medium text-[var(--text-primary,#212121)]">
            Delivery Address
          </h2>
          <p className="text-sm font-medium">
            {order.address.name} · {order.address.phone}
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary,#878787)]">
            {order.address.line1}
            {order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city},{" "}
            {order.address.state} - {order.address.pincode}
          </p>
        </section>
      )}

      <section className="rounded-sm bg-white shadow-sm">
        <h2 className="border-b border-[var(--border,#e0e0e0)] px-6 py-4 text-sm font-medium">
          Order Items
        </h2>
        <div className="divide-y divide-[var(--border,#e0e0e0)]">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 px-6 py-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-sm border border-[var(--border,#e0e0e0)] bg-white">
                {item.product.images[0] ? (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/p/${item.product.slug}`}
                  className="line-clamp-2 text-sm font-medium hover:text-[var(--primary,#2874f0)]"
                >
                  {item.product.title}
                </Link>
                <p className="mt-1 text-xs text-[var(--text-secondary,#878787)]">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold">{formatPaise(item.price * item.quantity)}</p>
                {item.mrp > item.price && (
                  <p className="text-xs text-[var(--text-secondary,#878787)] line-through">
                    {formatPaise(item.mrp * item.quantity)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-sm bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-medium">Payment Details</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--text-secondary,#878787)]">Payment Status</dt>
            <dd className={cn("font-medium uppercase", STATUS_STYLES[order.paymentStatus])}>
              {order.paymentStatus}
            </dd>
          </div>
          {order.paymentId && (
            <div className="flex justify-between">
              <dt className="text-[var(--text-secondary,#878787)]">Payment ID</dt>
              <dd className="font-mono text-xs">{order.paymentId}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-[var(--border,#e0e0e0)] pt-2">
            <dt className="font-medium">Total Amount</dt>
            <dd className="font-semibold">{formatPrice(order.totalAmount / 100)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
