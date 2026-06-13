"use client";

import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/format";
import type { Order } from "@/lib/order-api";
import { cn } from "@/lib/utils";

type OrderCardProps = {
  order: Order;
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function formatOrderDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function OrderCard({ order }: OrderCardProps) {
  const firstItem = order.items[0];
  const extraCount = order.items.length - 1;
  const title =
    extraCount > 0
      ? `${firstItem?.product.title ?? "Order"} and ${extraCount} more`
      : firstItem?.product.title ?? "Order";

  return (
    <article className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="relative size-14 overflow-hidden rounded-sm border-2 border-white bg-[var(--surface,#f1f3f6)]"
              >
                {item.product.images[0] ? (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                ) : null}
              </div>
            ))}
          </div>
          <div>
            <p className="line-clamp-2 text-sm font-medium text-[var(--text-primary,#212121)]">
              {title}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary,#878787)]">
              Ordered on {formatOrderDate(order.createdAt)}
            </p>
          </div>
        </div>

        <span
          className={cn(
            "rounded-sm px-2 py-1 text-xs font-medium uppercase",
            STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING,
          )}
        >
          {order.status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border,#e0e0e0)] pt-3">
        <p className="text-sm font-semibold text-[var(--text-primary,#212121)]">
          {formatPrice(order.totalAmount / 100)}
        </p>
        <Link
          href={`/account/orders/${order.id}`}
          className="text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
