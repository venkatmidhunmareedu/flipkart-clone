"use client";

import Image from "next/image";
import { ArrowDown, BadgeCheck, Minus, Plus } from "lucide-react";

import { StarRating } from "@/components/catalog/star-rating";
import { PriceDetailsPanel } from "@/components/checkout/price-details-panel";
import { useUpdateQuantity } from "@/hooks/use-cart";
import type { CartData, CartItem } from "@/lib/cart-api";
import type { Address } from "@/lib/address-api";
import type { DeliverabilityResult } from "@/lib/order-api";
import { formatPrice } from "@/lib/format";

type OrderSummaryStepProps = {
  cart: CartData;
  address: Address;
  deliverability: DeliverabilityResult | null;
  isCheckingDelivery: boolean;
  isProcessingPayment: boolean;
  onChangeAddress: () => void;
  onCheckConfirm: () => void;
  onContinue: () => void;
};

function variantLine(attributes: Record<string, string> | null | undefined) {
  if (!attributes) return null;

  if (attributes.size) {
    return `Size: ${attributes.size}`;
  }

  const dimensionKeys = ["width", "height", "length", "dimensions"];
  for (const key of dimensionKeys) {
    if (attributes[key]) {
      return attributes[key];
    }
  }

  const firstEntry = Object.entries(attributes)[0];
  return firstEntry ? `${firstEntry[0]}: ${firstEntry[1]}` : null;
}

function isUndeliverable(
  productId: string,
  deliverability: DeliverabilityResult | null,
) {
  return deliverability?.items.some(
    (item) => item.productId === productId && !item.deliverable,
  );
}

function OrderSummaryItem({
  item,
  pincode,
  deliverability,
}: {
  item: CartItem;
  pincode: string;
  deliverability: DeliverabilityResult | null;
}) {
  const updateQuantity = useUpdateQuantity();
  const { product, quantity } = item;
  const variant = variantLine(product.attributes);
  const undeliverable = isUndeliverable(product.id, deliverability);
  const isUpdating = updateQuantity.isPending;

  return (
    <article className="border-b border-[var(--border,#e0e0e0)] px-4 py-5 last:border-b-0">
      <div className="flex gap-4">
        <div className="relative shrink-0">
          <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-sm border border-[var(--border,#e0e0e0)] bg-[var(--surface,#f1f3f6)]">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                width={80}
                height={80}
                loading="lazy"
                className="size-full object-contain p-1"
              />
            ) : null}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="line-clamp-2 text-sm font-semibold text-[var(--text-primary,#212121)]">
              {product.title}
            </h3>
            {product.isAssured && (
              <span className="inline-flex items-center gap-0.5 rounded-sm bg-[var(--primary,#2874f0)]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--primary,#2874f0)]">
                <BadgeCheck className="size-3" />
                Assured
              </span>
            )}
          </div>

          {variant && (
            <p className="mt-1 text-xs text-[var(--text-secondary,#878787)]">{variant}</p>
          )}

          <div className="mt-1">
            <StarRating
              rating={product.rating}
              size="sm"
              showValue
              reviewCount={product.reviewCount}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {product.discountPercent > 0 && (
              <span className="inline-flex items-center gap-0.5 text-sm font-medium text-[var(--success,#388e3c)]">
                <ArrowDown className="size-3.5" />
                {product.discountPercent}%
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="text-xs text-[var(--text-secondary,#878787)] line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
            <span className="text-base font-semibold">{formatPrice(product.sellingPrice)}</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {product.reviewCount > 500 && (
              <span className="rounded-sm bg-[var(--success,#388e3c)] px-2 py-0.5 text-[10px] font-semibold text-white">
                BESTSELLER
              </span>
            )}
            {product.discountPercent >= 20 && (
              <span className="rounded-sm bg-[var(--danger,#d32f2f)] px-2 py-0.5 text-[10px] font-semibold text-white">
                Hot Deal
              </span>
            )}
          </div>

          {undeliverable && (
            <p className="mt-2 text-xs font-medium text-[var(--danger,#d32f2f)]">
              Currently out of stock for {pincode}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary,#878787)]">Qty:</span>
            <div className="flex items-center overflow-hidden rounded-sm border border-[var(--border,#e0e0e0)]">
              <button
                type="button"
                onClick={() =>
                  updateQuantity.mutate({ productId: product.id, quantity: quantity - 1 })
                }
                disabled={isUpdating || quantity <= 1}
                className="flex size-8 items-center justify-center hover:bg-[var(--surface,#f1f3f6)] disabled:opacity-50"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="flex size-8 items-center justify-center border-x border-[var(--border,#e0e0e0)] text-sm font-medium">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  updateQuantity.mutate({ productId: product.id, quantity: quantity + 1 })
                }
                disabled={isUpdating || quantity >= product.stock}
                className="flex size-8 items-center justify-center hover:bg-[var(--surface,#f1f3f6)] disabled:opacity-50"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function OrderSummaryStep({
  cart,
  address,
  deliverability,
  isCheckingDelivery,
  isProcessingPayment,
  onChangeAddress,
  onCheckConfirm,
  onContinue,
}: OrderSummaryStepProps) {
  const undeliverableCount =
    deliverability?.items.filter((item) => !item.deliverable).length ?? 0;
  const showPincodeWarning = undeliverableCount > 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {undeliverableCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm bg-[#1a237e] px-4 py-3 text-sm text-white">
            <span>
              {undeliverableCount} {undeliverableCount === 1 ? "item is" : "items are"} not
              deliverable to {address.pincode}. Please try changing the address.
            </span>
            <button
              type="button"
              onClick={onChangeAddress}
              className="font-medium underline-offset-2 hover:underline"
            >
              Change
            </button>
          </div>
        )}

        <div className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-[var(--text-secondary,#878787)]">Deliver to:</span>
              <span className="font-medium text-[var(--text-primary,#212121)]">
                {address.name}
              </span>
              <span className="rounded-sm bg-[var(--primary,#2874f0)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary,#2874f0)]">
                {address.type}
              </span>
            </div>
            <button
              type="button"
              onClick={onChangeAddress}
              className="text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
            >
              Change
            </button>
          </div>
          <p className="mt-1 text-sm text-[var(--text-secondary,#878787)]">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.pincode}
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary,#878787)]">{address.phone}</p>
        </div>

        {showPincodeWarning && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-[#ffcc80] bg-[#fff3e0] px-4 py-3">
            <span className="text-sm font-medium text-[#e65100]">
              Pincode does not match the address
            </span>
            <button
              type="button"
              onClick={onCheckConfirm}
              disabled={isCheckingDelivery}
              className="rounded-sm border border-[var(--primary,#2874f0)] px-4 py-1.5 text-sm font-medium text-[var(--primary,#2874f0)] hover:bg-[var(--primary,#2874f0)]/5 disabled:opacity-50"
            >
              {isCheckingDelivery ? "Checking..." : "Check & Confirm"}
            </button>
          </div>
        )}

        <div className="overflow-hidden rounded-sm border border-[var(--border,#e0e0e0)] bg-white">
          <div className="border-b border-[var(--border,#e0e0e0)] px-4 py-3">
            <h2 className="text-base font-medium">Order Summary</h2>
          </div>
          {cart.items.map((item) => (
            <OrderSummaryItem
              key={item.id}
              item={item}
              pincode={address.pincode}
              deliverability={deliverability}
            />
          ))}
        </div>
      </div>

      <PriceDetailsPanel
        summary={cart.summary}
        undeliverableCount={undeliverableCount}
        onContinue={onContinue}
        isProcessing={isProcessingPayment}
      />
    </div>
  );
}
