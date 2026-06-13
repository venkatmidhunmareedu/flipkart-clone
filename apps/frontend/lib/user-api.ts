import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type ApiSuccess<T> = { data: T };
type ApiError = { error: { message: string; code: string } };

export type UserProfile = {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string | null;
  gender: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
};

async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.accessToken ?? null;
}

async function userFetch<T>(
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

export async function fetchUserProfile() {
  return userFetch<{ user: UserProfile }>("/api/users/me");
}

export async function updateUserProfile(input: UpdateProfileInput) {
  return userFetch<{ user: UserProfile }>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function updateUserEmail(newEmail: string) {
  return userFetch<{ user: UserProfile }>("/api/users/me/email", {
    method: "PATCH",
    body: JSON.stringify({ newEmail }),
  });
}

export async function changeUserPassword(currentPassword: string, newPassword: string) {
  return userFetch<{ changed: boolean }>("/api/users/me/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
