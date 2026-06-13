import crypto from "crypto";

import Razorpay from "razorpay";

import prisma from "../lib/prisma";
import {
  orderConfirmationEmailHtml,
  orderConfirmationEmailText,
} from "../lib/email-templates";
import { formatProduct } from "../lib/format-product";
import { getMailer, isMailerConfigured } from "../lib/mailer";
import { getCart } from "./cart.service";

export class OrderError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "OrderError";
  }
}

function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new OrderError(
      "Payment gateway not configured",
      "PAYMENT_NOT_CONFIGURED",
      503,
    );
  }

  return new Razorpay({ key_id, key_secret });
}

export function calculateOrderFees(subtotalPaise: number) {
  const deliveryFee = subtotalPaise >= 50000 ? 0 : 4000;
  const platformFee =
    subtotalPaise < 20000 ? 4000 : subtotalPaise < 50000 ? 8000 : 14500;

  return { deliveryFee, platformFee };
}

export function formatOrderDisplayId(orderId: string) {
  return `ORD-${orderId.slice(-8).toUpperCase()}`;
}

function estimatedDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toISOString();
}

function formatEstimatedDeliveryDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatOrder(order: {
  id: string;
  userId: string;
  addressId: string;
  status: string;
  paymentStatus: string;
  razorpayOrderId: string | null;
  paymentId: string | null;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  address?: {
    id: string;
    name: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
    type: string;
  };
  items?: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    mrp: number;
    product: Parameters<typeof formatProduct>[0];
  }>;
}) {
  const subtotal =
    order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  const mrpTotal =
    order.items?.reduce((sum, item) => sum + item.mrp * item.quantity, 0) ?? 0;
  const discount = mrpTotal - subtotal;
  const fees = calculateOrderFees(subtotal);
  const estimatedDelivery = estimatedDeliveryDate();

  return {
    id: order.id,
    displayId: formatOrderDisplayId(order.id),
    userId: order.userId,
    addressId: order.addressId,
    status: order.status,
    paymentStatus: order.paymentStatus,
    razorpayOrderId: order.razorpayOrderId,
    paymentId: order.paymentId,
    totalAmount: order.totalAmount,
    subtotal,
    mrpTotal,
    discount,
    fees,
    estimatedDelivery,
    estimatedDeliveryLabel: formatEstimatedDeliveryDate(estimatedDelivery),
    address: order.address
      ? {
          id: order.address.id,
          name: order.address.name,
          phone: order.address.phone,
          line1: order.address.line1,
          line2: order.address.line2,
          city: order.address.city,
          state: order.address.state,
          pincode: order.address.pincode,
          type: order.address.type,
        }
      : undefined,
    items:
      order.items?.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        mrp: item.mrp,
        product: formatProduct(item.product),
      })) ?? [],
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

export async function createRazorpayOrder(amountPaise: number) {
  const razorpay = getRazorpayInstance();
  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
  };
}

export async function checkDeliverability(pincode: string, productIds: string[]) {
  if (!/^\d{6}$/.test(pincode)) {
    throw new OrderError("Invalid pincode", "VALIDATION_ERROR", 400);
  }

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, stock: true },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  const items = productIds.map((productId) => {
    const product = productMap.get(productId);

    if (!product) {
      return { productId, deliverable: false, reason: "Product not found" };
    }

    if (product.stock <= 0) {
      return {
        productId,
        deliverable: false,
        reason: "Out of stock",
      };
    }

    return { productId, deliverable: true };
  });

  return {
    deliverable: items.every((item) => item.deliverable),
    items,
  };
}

async function sendOrderConfirmationEmail(order: {
  id: string;
  totalAmount: number;
  user: { email: string; firstName: string };
  address: {
    name: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    quantity: number;
    price: number;
    product: { title: string };
  }>;
}) {
  const displayId = formatOrderDisplayId(order.id);
  const estimatedDelivery = formatEstimatedDeliveryDate(estimatedDeliveryDate());
  const subject = `Order Confirmed — Order #${displayId}`;
  const html = orderConfirmationEmailHtml({
    displayId,
    items: order.items.map((item) => ({
      title: item.product.title,
      quantity: item.quantity,
      pricePaise: item.price,
    })),
    totalAmountPaise: order.totalAmount,
    estimatedDelivery,
    address: order.address,
  });
  const text = orderConfirmationEmailText({
    displayId,
    items: order.items.map((item) => ({
      title: item.product.title,
      quantity: item.quantity,
      pricePaise: item.price,
    })),
    totalAmountPaise: order.totalAmount,
    estimatedDelivery,
    address: order.address,
  });

  if (!isMailerConfigured()) {
    console.log("[order-email]", subject);
    console.log(text);
    return;
  }

  const mailer = getMailer();
  await mailer.sendMail({
    from: process.env.GMAIL_USER,
    to: order.user.email,
    subject,
    text,
    html,
  });
}

export async function placeOrder(userId: string, params: { addressId: string }) {
  const address = await prisma.address.findFirst({
    where: { id: params.addressId, userId },
  });

  if (!address) {
    throw new OrderError("Address not found", "NOT_FOUND", 404);
  }

  const cart = await getCart(userId);

  if (cart.items.length === 0) {
    throw new OrderError("Cart is empty", "EMPTY_CART", 400);
  }

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new OrderError(
        `Insufficient stock for ${item.product.title}`,
        "INSUFFICIENT_STOCK",
        400,
      );
    }
  }

  const subtotal = cart.summary.total;
  const { deliveryFee, platformFee } = calculateOrderFees(subtotal);
  const totalAmount = subtotal + deliveryFee + platformFee;

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId: params.addressId,
        totalAmount,
        status: "PENDING",
        paymentStatus: "PENDING",
      },
    });

    for (const item of cart.items) {
      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.sellingPricePaise,
          mrp: item.product.mrpPaise,
        },
      });

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId } });

    return newOrder;
  });

  const razorpayOrder = await createRazorpayOrder(totalAmount);

  await prisma.order.update({
    where: { id: order.id },
    data: { razorpayOrderId: razorpayOrder.id },
  });

  return {
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    amount: totalAmount,
    currency: razorpayOrder.currency,
  };
}

export async function verifyPayment(
  userId: string,
  orderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      address: true,
      user: true,
      items: {
        include: {
          product: {
            include: {
              category: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new OrderError("Order not found", "NOT_FOUND", 404);
  }

  if (!order.razorpayOrderId) {
    throw new OrderError("Invalid order state", "INVALID_STATE", 400);
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    throw new OrderError(
      "Payment gateway not configured",
      "PAYMENT_NOT_CONFIGURED",
      503,
    );
  }

  const body = `${order.razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "FAILED" },
    });
    throw new OrderError("Payment verification failed", "PAYMENT_FAILED", 400);
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      paymentId: razorpayPaymentId,
    },
    include: {
      address: true,
      user: true,
      items: {
        include: {
          product: {
            include: {
              category: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
      },
    },
  });

  await sendOrderConfirmationEmail(updated);

  return formatOrder(updated);
}

export async function getOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      address: true,
      items: {
        include: {
          product: {
            include: {
              category: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map(formatOrder);
}

export async function getOrderById(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      address: true,
      items: {
        include: {
          product: {
            include: {
              category: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new OrderError("Order not found", "NOT_FOUND", 404);
  }

  return formatOrder(order);
}
