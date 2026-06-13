"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { getOrderById, getOrders, type Order } from "@/lib/order-api";

export const ORDERS_QUERY_KEY = ["orders"] as const;

export function useOrders() {
  const { status } = useSession();

  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: async () => {
      const result = await getOrders();
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data.orders;
    },
    enabled: status === "authenticated",
  });
}

export function useOrder(id: string) {
  const { status } = useSession();

  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, id],
    queryFn: async () => {
      const result = await getOrderById(id);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data.order;
    },
    enabled: status === "authenticated" && Boolean(id),
  });
}

export type { Order };
