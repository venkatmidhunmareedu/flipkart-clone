import type { Request, Response } from "express";
import type { z } from "zod";

import { param } from "../lib/param";
import { validateBody } from "./auth.controller";
import {
  checkDeliverySchema,
  confirmOrderSchema,
  initiateOrderSchema,
} from "../lib/validators/order.validators";
import {
  OrderError,
  checkDeliverability,
  getOrderById,
  getOrders,
  placeOrder,
  verifyPayment,
} from "../services/order.service";

function handleOrderError(error: unknown, res: Response) {
  if (error instanceof OrderError) {
    res.status(error.statusCode).json({
      error: { message: error.message, code: error.code },
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    error: { message: "Internal server error", code: "INTERNAL_ERROR" },
  });
}

export async function initiateOrderHandler(req: Request, res: Response) {
  try {
    const body = (req as Request & { validated: z.infer<typeof initiateOrderSchema> })
      .validated;
    const result = await placeOrder(req.user!.id, body);
    res.status(201).json({ data: result });
  } catch (error) {
    handleOrderError(error, res);
  }
}

export async function confirmOrderHandler(req: Request, res: Response) {
  try {
    const body = (req as Request & { validated: z.infer<typeof confirmOrderSchema> })
      .validated;
    const order = await verifyPayment(
      req.user!.id,
      body.orderId,
      body.razorpayPaymentId,
      body.razorpaySignature,
    );
    res.json({ data: { order } });
  } catch (error) {
    handleOrderError(error, res);
  }
}

export async function getOrdersHandler(req: Request, res: Response) {
  try {
    const orders = await getOrders(req.user!.id);
    res.json({ data: { orders } });
  } catch (error) {
    handleOrderError(error, res);
  }
}

export async function getOrderByIdHandler(req: Request, res: Response) {
  try {
    const order = await getOrderById(req.user!.id, param(req.params.id));
    res.json({ data: { order } });
  } catch (error) {
    handleOrderError(error, res);
  }
}

export async function checkDeliveryHandler(req: Request, res: Response) {
  try {
    const body = (req as Request & { validated: z.infer<typeof checkDeliverySchema> })
      .validated;
    const result = await checkDeliverability(body.pincode, body.productIds);
    res.json({ data: result });
  } catch (error) {
    handleOrderError(error, res);
  }
}

export const validateInitiateOrder = validateBody(initiateOrderSchema);
export const validateConfirmOrder = validateBody(confirmOrderSchema);
export const validateCheckDelivery = validateBody(checkDeliverySchema);
