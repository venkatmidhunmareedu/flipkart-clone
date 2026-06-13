import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <>
      <h1 className="mb-4 text-xl font-semibold text-[var(--text-primary,#212121)]">Checkout</h1>
      <CheckoutFlow />
    </>
  );
}
