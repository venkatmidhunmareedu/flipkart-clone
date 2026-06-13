import Link from "next/link";
import { ChevronRight, Tag } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-sm bg-gradient-to-r from-[var(--primary,#2874f0)] to-[#1a5fd1] shadow-sm">
      <div className="flex flex-col items-start justify-between gap-6 px-6 py-8 md:flex-row md:items-center md:px-10 md:py-10">
        <div className="max-w-lg text-white">
          <p className="mb-1 text-sm font-medium uppercase tracking-wider text-[var(--accent,#ffe500)]">
            End of Season Sale
          </p>
          <h2 className="text-2xl font-bold leading-tight md:text-3xl">
            Up to 70% Off on Top Brands
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Use coupon <span className="font-semibold text-[var(--accent,#ffe500)]">SALE2026</span>{" "}
            · Valid till 30 June 2026
          </p>
          <Link
            href="/search?q=sale"
            className="mt-4 inline-flex items-center gap-1 rounded-sm bg-[var(--accent,#ffe500)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary,#212121)] transition-transform hover:scale-[1.02]"
          >
            Shop Now
            <ChevronRight className="size-4" />
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-3 rounded-sm bg-white/10 px-5 py-4 backdrop-blur-sm">
          <Tag className="size-8 text-[var(--accent,#ffe500)]" />
          <div className="text-white">
            <p className="text-xs uppercase tracking-wide opacity-80">Extra 10% off</p>
            <p className="text-lg font-bold">Axis Bank Cards</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-8 -bottom-8 size-40 rounded-full bg-[var(--accent,#ffe500)]/20" />
      <div className="absolute -top-4 right-1/4 size-24 rounded-full bg-white/10" />
    </section>
  );
}
