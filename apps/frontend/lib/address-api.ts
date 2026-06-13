import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type ApiSuccess<T> = { data: T };
type ApiError = { error: { message: string; code: string } };

export type AddressType = "HOME" | "WORK" | "OTHER";

export type Address = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  type: AddressType;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateAddressInput = {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  type?: AddressType;
  isDefault?: boolean;
};

async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.accessToken ?? null;
}

async function addressFetch<T>(
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

export async function fetchAddresses() {
  return addressFetch<{ addresses: Address[] }>("/api/addresses");
}

export async function createAddress(input: CreateAddressInput) {
  return addressFetch<{ address: Address }>("/api/addresses", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateAddress(id: string, input: Partial<CreateAddressInput>) {
  return addressFetch<{ address: Address }>(`/api/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteAddress(id: string) {
  return addressFetch<{ deleted: boolean }>(`/api/addresses/${id}`, {
    method: "DELETE",
  });
}

export async function setDefaultAddress(id: string) {
  return addressFetch<{ address: Address }>(`/api/addresses/${id}/default`, {
    method: "PATCH",
  });
}
