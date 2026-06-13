import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
});

export const updateEmailSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});
