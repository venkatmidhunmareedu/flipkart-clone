import type { Request, Response } from "express";

import { param } from "../lib/param";
import { validateBody } from "./auth.controller";
import {
  addToCartSchema,
  updateCartQuantitySchema,
} from "../lib/validators/cart.validators";
import {
  CartError,
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../services/cart.service";

export { validateBody };

function handleCartError(error: unknown, res: Response) {
  if (error instanceof CartError) {
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

export async function getCartHandler(req: Request, res: Response) {
  try {
    const cart = await getCart(req.user!.id);
    res.json({ data: cart });
  } catch (error) {
    handleCartError(error, res);
  }
}

export async function addToCartHandler(req: Request, res: Response) {
  try {
    const body = (req as Request & {
      validated: { productId: string; quantity?: number };
    }).validated;

    const cart = await addToCart(req.user!.id, body.productId, body.quantity ?? 1);
    res.status(201).json({ data: cart });
  } catch (error) {
    handleCartError(error, res);
  }
}

export async function updateQuantityHandler(req: Request, res: Response) {
  try {
    const body = (req as Request & { validated: { quantity: number } }).validated;
    const cart = await updateCartQuantity(
      req.user!.id,
      param(req.params.productId),
      body.quantity,
    );
    res.json({ data: cart });
  } catch (error) {
    handleCartError(error, res);
  }
}

export async function removeFromCartHandler(req: Request, res: Response) {
  try {
    const cart = await removeFromCart(req.user!.id, param(req.params.productId));
    res.json({ data: cart });
  } catch (error) {
    handleCartError(error, res);
  }
}

export async function clearCartHandler(req: Request, res: Response) {
  try {
    const cart = await clearCart(req.user!.id);
    res.json({ data: cart });
  } catch (error) {
    handleCartError(error, res);
  }
}

export const validateAddToCart = validateBody(addToCartSchema);
export const validateUpdateQuantity = validateBody(updateCartQuantitySchema);
