"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ShieldCheck, CreditCard } from "lucide-react";

import { AddressStep } from "@/components/checkout/address-step";
import { OrderSummaryStep } from "@/components/checkout/order-summary-step";
import { StepIndicator, type CheckoutStep } from "@/components/checkout/step-indicator";
import { CART_QUERY_KEY, useCart } from "@/hooks/use-cart";
import type { Address } from "@/lib/address-api";
import { checkDelivery, confirmOrder, initiateOrder, type DeliverabilityResult } from "@/lib/order-api";
import { openRazorpayCheckout } from "@/lib/razorpay";

type PaymentPhase = "idle" | "initiating" | "open" | "confirming";

export function CheckoutFlow() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { data: cart, isLoading, error } = useCart();

  const [step, setStep] = useState<CheckoutStep>(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deliverability, setDeliverability] = useState<DeliverabilityResult | null>(null);
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);
  const [paymentPhase, setPaymentPhase] = useState<PaymentPhase>("idle");

  const isProcessingPayment = paymentPhase !== "idle";

  const refreshDeliverability = useCallback(
    async (address: Address) => {
      if (!cart?.items.length) return;

      setIsCheckingDelivery(true);
      const result = await checkDelivery(
        address.pincode,
        cart.items.map((item) => item.productId),
      );
      setIsCheckingDelivery(false);

      if (result.ok) {
        setDeliverability(result.data);
      } else {
        toast.error(result.error.message);
      }
    },
    [cart],
  );

  function handleSelectAddress(address: Address) {
    setSelectedAddress(address);
    setStep(2);
    void refreshDeliverability(address);
  }

  async function handleCheckConfirm() {
    if (!selectedAddress) return;
    await refreshDeliverability(selectedAddress);
  }

  async function handleContinueToPayment() {
    if (!selectedAddress || !cart?.items.length || !session?.user) {
      return;
    }

    setStep(3);
    setPaymentPhase("initiating");

    const initiateResult = await initiateOrder(selectedAddress.id);

    if (!initiateResult.ok) {
      toast.error(initiateResult.error.message);
      setStep(2);
      setPaymentPhase("idle");
      return;
    }

    const { orderId, razorpayOrderId, amount } = initiateResult.data;
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      toast.error("Payment gateway is not configured");
      setStep(2);
      setPaymentPhase("idle");
      return;
    }

    await openRazorpayCheckout({
      key: razorpayKey,
      amount,
      currency: "INR",
      name: "Flipkart Clone",
      description: "Order payment",
      order_id: razorpayOrderId,
      prefill: {
        name: session.user.name ?? undefined,
        email: session.user.email ?? undefined,
        contact: selectedAddress.phone,
      },
      theme: { color: "#2874f0" },
      onSuccess: async (response) => {
        setPaymentPhase("confirming");

        const confirmResult = await confirmOrder(
          orderId,
          response.razorpay_payment_id,
          response.razorpay_signature,
        );

        if (!confirmResult.ok) {
          toast.error(confirmResult.error.message);
          setStep(2);
          setPaymentPhase("idle");
          return;
        }

        toast.success("Order placed successfully!");
        void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        router.push(`/order-confirmation/${orderId}`);
      },
      onDismiss: () => {
        setPaymentPhase("idle");
        setStep(2);
        toast.message("Payment cancelled");
      },
      onFailure: (message) => {
        setPaymentPhase("idle");
        setStep(2);
        toast.error(message);
      },
    });

    setPaymentPhase("open");
  }

  if (isLoading) {
    return (
      <p className="py-12 text-center text-sm text-[var(--text-secondary,#878787)]">
        Loading checkout...
      </p>
    );
  }

  if (error) {
    return (
      <div className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white p-8 text-center">
        <p className="text-[var(--danger,#d32f2f)]">{error.message}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white p-8 text-center">
        <p className="text-[var(--text-secondary,#878787)]">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <AddressStep
          selectedAddressId={selectedAddress?.id ?? null}
          onSelectAddress={handleSelectAddress}
        />
      )}

      {step === 2 && selectedAddress && (
        <OrderSummaryStep
          cart={cart}
          address={selectedAddress}
          deliverability={deliverability}
          isCheckingDelivery={isCheckingDelivery}
          isProcessingPayment={isProcessingPayment}
          onChangeAddress={() => setStep(1)}
          onCheckConfirm={handleCheckConfirm}
          onContinue={handleContinueToPayment}
        />
      )}

      {step === 3 && selectedAddress && (
        <>
          {paymentPhase === "initiating" && (
            <div className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white px-8 py-16 text-center">
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--primary,#2874f0)]/10">
                <CreditCard className="size-8 text-[var(--primary,#2874f0)]" />
              </div>
              <Loader2 className="mx-auto mb-4 size-8 animate-spin text-[var(--primary,#2874f0)]" />
              <p className="text-base font-semibold text-[var(--text-primary,#212121)]">
                Preparing your payment window…
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary,#878787)]">
                Please wait while we connect to the payment gateway
              </p>
            </div>
          )}

          {paymentPhase === "open" && (
            <div className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white px-8 py-16 text-center">
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--primary,#2874f0)]/10">
                <CreditCard className="size-8 text-[var(--primary,#2874f0)]" />
              </div>
              <p className="text-base font-semibold text-[var(--text-primary,#212121)]">
                Complete payment in the Razorpay window
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary,#878787)]">
                Delivering to{" "}
                <span className="font-medium text-[var(--text-primary,#212121)]">
                  {selectedAddress.name}
                </span>
                , {selectedAddress.pincode}
              </p>
              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className="size-2 animate-bounce rounded-full bg-[var(--primary,#2874f0)] [animation-delay:0ms]" />
                <span className="size-2 animate-bounce rounded-full bg-[var(--primary,#2874f0)] [animation-delay:150ms]" />
                <span className="size-2 animate-bounce rounded-full bg-[var(--primary,#2874f0)] [animation-delay:300ms]" />
              </div>
              <button
                type="button"
                onClick={() => { setStep(2); setPaymentPhase("idle"); }}
                className="mt-6 text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
              >
                Back to order summary
              </button>
            </div>
          )}

          {paymentPhase === "confirming" && (
            <div className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white px-8 py-16 text-center">
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--success,#388e3c)]/10">
                <ShieldCheck className="size-8 text-[var(--success,#388e3c)]" />
              </div>
              <Loader2 className="mx-auto mb-4 size-8 animate-spin text-[var(--success,#388e3c)]" />
              <p className="text-base font-semibold text-[var(--text-primary,#212121)]">
                Verifying your payment…
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary,#878787)]">
                Please stay on this page — your order is being confirmed
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
