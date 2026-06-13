"use client";

import Link from "next/link";

import { useOrders } from "@/hooks/use-orders";

import { OrderCard } from "./order-card";

export function OrderList() {
  const { data: orders, isLoading, isError, error } = useOrders();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((key) => (
          <div key={key} className="h-32 animate-pulse rounded-sm bg-white" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-[var(--danger,#d32f2f)]">{error.message}</p>;
  }

  const orderList = orders ?? [];

  if (orderList.length === 0) {
    return (
      <div className="rounded-sm bg-white p-8 text-center shadow-sm">
        <p className="text-[var(--text-secondary,#878787)]">
          No orders placed yet — Start shopping!
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orderList.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
