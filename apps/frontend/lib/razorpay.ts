import type { RazorpayInstance, RazorpayOptions } from "@/types/razorpay";

let scriptPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export async function openRazorpayCheckout(
  options: Omit<RazorpayOptions, "handler"> & {
    onSuccess: RazorpayOptions["handler"];
    onDismiss?: () => void;
    onFailure?: (message: string) => void;
  },
): Promise<RazorpayInstance | null> {
  const loaded = await loadRazorpayScript();

  if (!loaded || !window.Razorpay) {
    options.onFailure?.("Unable to load payment gateway");
    return null;
  }

  const razorpay = new window.Razorpay({
    ...options,
    handler: options.onSuccess,
    modal: {
      ondismiss: options.onDismiss,
    },
  });

  razorpay.on("payment.failed", (response) => {
    options.onFailure?.(response.error?.description ?? "Payment failed");
  });

  razorpay.open();
  return razorpay;
}
