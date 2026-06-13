import Link from "next/link";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-120px)] bg-[var(--surface,#f1f3f6)]">
      <header className="border-b border-[var(--border,#e0e0e0)] bg-[var(--primary,#2874f0)] px-4 py-3 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Flipkart<span className="text-[var(--accent,#ffe500)]"> Clone</span>
          </Link>
          <p className="text-sm font-medium">Secure Checkout</p>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
    </div>
  );
}
