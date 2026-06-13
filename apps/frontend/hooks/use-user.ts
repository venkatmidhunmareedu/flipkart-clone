"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  changeUserPassword,
  fetchUserProfile,
  updateUserEmail,
  updateUserProfile,
  type UpdateProfileInput,
  type UserProfile,
} from "@/lib/user-api";

export const USER_QUERY_KEY = ["user"] as const;

export function useUser() {
  const { status } = useSession();

  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      const result = await fetchUserProfile();
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data.user;
    },
    enabled: status === "authenticated",
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const result = await updateUserProfile(input);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data.user;
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useUpdateEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEmail: string) => {
      const result = await updateUserEmail(newEmail);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data.user;
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const result = await changeUserPassword(currentPassword, newPassword);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  });
}

export type { UserProfile };
