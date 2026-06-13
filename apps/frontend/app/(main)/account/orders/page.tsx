"use client";

import { OrderList } from "@/components/account/order-list";

export default function AccountOrdersPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-medium text-[var(--text-primary,#212121)]">MY ORDERS</h1>
      <OrderList />
    </div>
  );
}
