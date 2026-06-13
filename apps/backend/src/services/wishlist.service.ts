import type { Prisma } from "@prisma/client";

import prisma from "../lib/prisma";
import { formatProduct } from "../lib/format-product";

export class WishlistError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "WishlistError";
  }
}

const productInclude = {
  category: {
    select: { id: true, name: true, slug: true },
  },
} as const;

type WishlistItemWithProduct = Prisma.WishlistItemGetPayload<{
  include: {
    product: { include: typeof productInclude };
  };
}>;

type WishlistItemProductId = Prisma.WishlistItemGetPayload<{
  select: { productId: true };
}>;

export async function getWishlist(userId: string) {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: { include: productInclude },
    },
    orderBy: { createdAt: "desc" },
  });

  return items.map((item: WishlistItemWithProduct) => ({
    id: item.id,
    productId: item.productId,
    createdAt: item.createdAt.toISOString(),
    product: formatProduct(item.product),
  }));
}

export async function getWishlistProductIds(userId: string) {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    select: { productId: true },
  });

  return items.map((item: WishlistItemProductId) => item.productId);
}

export async function isInWishlist(userId: string, productId: string) {
  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  return Boolean(item);
}

export async function addToWishlist(userId: string, productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new WishlistError("Product not found", "NOT_FOUND", 404);
  }

  const item = await prisma.wishlistItem.upsert({
    where: {
      userId_productId: { userId, productId },
    },
    create: { userId, productId },
    update: {},
    include: {
      product: { include: productInclude },
    },
  });

  return {
    id: item.id,
    productId: item.productId,
    createdAt: item.createdAt.toISOString(),
    product: formatProduct(item.product),
  };
}

export async function removeFromWishlist(userId: string, productId: string) {
  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (!item) {
    throw new WishlistError("Wishlist item not found", "NOT_FOUND", 404);
  }

  await prisma.wishlistItem.delete({
    where: { id: item.id },
  });

  return { removed: true, productId };
}
