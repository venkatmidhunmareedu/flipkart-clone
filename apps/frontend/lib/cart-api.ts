import { getSession } from "next-auth/react";

import type { Product } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type ApiSuccess<T> = { data: T };
type ApiError = { error: { message: string; code: string } };

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  priceAtAdd: number;
  product: Product;
};

export type CartSummary = {
  mrpTotal: number;
  discount: number;
  total: number;
  itemCount: number;
};

export type CartData = {
  items: CartItem[];
  summary: CartSummary;
};

async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.accessToken ?? null;
}

async function cartFetch<T>(
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

export async function fetchCart() {
  return cartFetch<CartData>("/api/cart");
}

export async function addToCart(productId: string, quantity = 1) {
  return cartFetch<CartData>("/api/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateQuantity(productId: string, quantity: number) {
  return cartFetch<CartData>(`/api/cart/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeFromCart(productId: string) {
  return cartFetch<CartData>(`/api/cart/${productId}`, {
    method: "DELETE",
  });
}
