import type { Request, Response } from "express";

import { validateBody } from "./auth.controller";
import { addToWishlistSchema } from "../lib/validators/wishlist.validators";
import {
  WishlistError,
  addToWishlist,
  getWishlist,
  getWishlistProductIds,
  removeFromWishlist,
} from "../services/wishlist.service";

function handleWishlistError(error: unknown, res: Response) {
  if (error instanceof WishlistError) {
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

export async function getWishlistHandler(req: Request, res: Response) {
  try {
    const items = await getWishlist(req.user!.id);
    res.json({ data: { items } });
  } catch (error) {
    handleWishlistError(error, res);
  }
}

export async function getWishlistIdsHandler(req: Request, res: Response) {
  try {
    const productIds = await getWishlistProductIds(req.user!.id);
    res.json({ data: { productIds } });
  } catch (error) {
    handleWishlistError(error, res);
  }
}

export async function addToWishlistHandler(req: Request, res: Response) {
  try {
    const body = (req as Request & { validated: { productId: string } }).validated;
    const item = await addToWishlist(req.user!.id, body.productId);
    res.status(201).json({ data: { item } });
  } catch (error) {
    handleWishlistError(error, res);
  }
}

export async function removeFromWishlistHandler(req: Request, res: Response) {
  try {
    const result = await removeFromWishlist(req.user!.id, req.params.productId);
    res.json({ data: result });
  } catch (error) {
    handleWishlistError(error, res);
  }
}

export const validateAddToWishlist = validateBody(addToWishlistSchema);
