import { getSession } from "next-auth/react";

import type { Product } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type ApiSuccess<T> = { data: T };
type ApiError = { error: { message: string; code: string } };

export type OrderFees = {
  deliveryFee: number;
  platformFee: number;
};

export type OrderAddress = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  type: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  mrp: number;
  product: Product;
};

export type Order = {
  id: string;
  displayId: string;
  userId: string;
  addressId: string;
  status: string;
  paymentStatus: string;
  razorpayOrderId: string | null;
  paymentId: string | null;
  totalAmount: number;
  subtotal: number;
  mrpTotal: number;
  discount: number;
  fees: OrderFees;
  estimatedDelivery: string;
  estimatedDeliveryLabel: string;
  address?: OrderAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type InitiateOrderResult = {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
};

export type DeliverabilityItem = {
  productId: string;
  deliverable: boolean;
  reason?: string;
};

export type DeliverabilityResult = {
  deliverable: boolean;
  items: DeliverabilityItem[];
};

async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.accessToken ?? null;
}

async function orderFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; error: ApiError["error"] }> {
  const token = await getAccessToken();

  if (!token) {
    return {
      ok: false,
      error: { message: "Unauthorized", code: "UNAUTHORIZED" },
    };
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  let json: ApiSuccess<T> | ApiError;
  try {
    json = (await response.json()) as ApiSuccess<T> | ApiError;
  } catch {
    return {
      ok: false,
      error: { message: "Invalid response from server", code: "PARSE_ERROR" },
    };
  }

  if (!response.ok || "error" in json) {
    return {
      ok: false,
      error: "error" in json ? json.error : { message: "Request failed", code: "UNKNOWN" },
    };
  }

  return { ok: true, data: json.data };
}

export async function initiateOrder(addressId: string) {
  return orderFetch<InitiateOrderResult>("/api/orders/initiate", {
    method: "POST",
    body: JSON.stringify({ addressId }),
  });
}

export async function confirmOrder(
  orderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
) {
  return orderFetch<{ order: Order }>("/api/orders/confirm", {
    method: "POST",
    body: JSON.stringify({ orderId, razorpayPaymentId, razorpaySignature }),
  });
}

export async function getOrders() {
  return orderFetch<{ orders: Order[] }>("/api/orders");
}

export async function getOrderById(id: string) {
  return orderFetch<{ order: Order }>(`/api/orders/${id}`);
}

export async function checkDelivery(pincode: string, productIds: string[]) {
  return orderFetch<DeliverabilityResult>("/api/orders/check-delivery", {
    method: "POST",
    body: JSON.stringify({ pincode, productIds }),
  });
}

export function calculateOrderFees(subtotalPaise: number): OrderFees {
  const deliveryFee = subtotalPaise >= 50000 ? 0 : 4000;
  const platformFee =
    subtotalPaise < 20000 ? 4000 : subtotalPaise < 50000 ? 8000 : 14500;

  return { deliveryFee, platformFee };
}
