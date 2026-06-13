import { z } from "zod";

export const initiateOrderSchema = z.object({
  addressId: z.string().min(1, "Address is required"),
});

export const confirmOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  razorpayPaymentId: z.string().min(1, "Payment ID is required"),
  razorpaySignature: z.string().min(1, "Signature is required"),
});

export const checkDeliverySchema = z.object({
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  productIds: z.array(z.string().min(1)).min(1, "At least one product is required"),
});
