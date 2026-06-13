import { z } from "zod";

const pincodeSchema = z
  .string()
  .regex(/^\d{6}$/, "Pincode must be 6 digits");

const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const createAddressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: phoneSchema,
  line1: z.string().min(3, "Flat/House No. is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: pincodeSchema,
  type: z.enum(["HOME", "WORK", "OTHER"]).default("HOME"),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
