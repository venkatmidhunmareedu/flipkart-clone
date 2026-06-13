import prisma from "../lib/prisma";
import { formatProduct } from "../lib/format-product";

export class CartError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "CartError";
  }
}

function buildCartResponse(
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    priceAtAdd: number;
    product: Parameters<typeof formatProduct>[0];
  }>,
) {
  let mrpTotal = 0;
  let total = 0;
  let itemCount = 0;

  const formattedItems = items.map((item) => {
    mrpTotal += item.product.mrp * item.quantity;
    total += item.product.sellingPrice * item.quantity;
    itemCount += item.quantity;

    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      priceAtAdd: item.priceAtAdd,
      product: formatProduct(item.product),
    };
  });

  return {
    items: formattedItems,
    summary: {
      mrpTotal,
      discount: mrpTotal - total,
      total,
      itemCount,
    },
  };
}

export async function getCart(userId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return buildCartResponse(items);
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity = 1,
) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new CartError("Product not found", "NOT_FOUND", 404);
  }

  if (product.stock < quantity) {
    throw new CartError("Insufficient stock", "INSUFFICIENT_STOCK", 400);
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (existing) {
    const newQuantity = existing.quantity + quantity;

    if (product.stock < newQuantity) {
      throw new CartError("Insufficient stock", "INSUFFICIENT_STOCK", 400);
    }

    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
        priceAtAdd: product.sellingPrice,
      },
    });
  }

  return getCart(userId);
}

export async function updateCartQuantity(
  userId: string,
  productId: string,
  quantity: number,
) {
  if (quantity < 1) {
    throw new CartError("Quantity must be at least 1", "INVALID_QUANTITY", 400);
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
    include: { product: true },
  });

  if (!cartItem) {
    throw new CartError("Cart item not found", "NOT_FOUND", 404);
  }

  if (cartItem.product.stock < quantity) {
    throw new CartError("Insufficient stock", "INSUFFICIENT_STOCK", 400);
  }

  await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity },
  });

  return getCart(userId);
}

export async function removeFromCart(userId: string, productId: string) {
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (!cartItem) {
    throw new CartError("Cart item not found", "NOT_FOUND", 404);
  }

  await prisma.cartItem.delete({
    where: { id: cartItem.id },
  });

  return getCart(userId);
}

export async function clearCart(userId: string) {
  await prisma.cartItem.deleteMany({
    where: { userId },
  });

  return getCart(userId);
}
