import Link from "next/link";
import { Tag } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-sm bg-gradient-to-r from-[#ffe500] via-[#ffed4a] to-[#ffe500] shadow-sm">
      <div className="flex flex-col items-start justify-between gap-6 px-6 py-8 md:flex-row md:items-center md:px-10 md:py-10">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold leading-tight text-[var(--primary,#2874f0)] md:text-3xl">
            Exclusive coupon for you!
          </h2>
          <p className="mt-2 text-sm font-medium text-[var(--text-primary,#212121)]">
            Flat 10% Off · Up to ₹100 on your first order
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2 rounded-sm bg-[var(--primary,#2874f0)] px-6 py-4 text-white shadow-md">
          <Tag className="size-6 text-[var(--accent,#ffe500)]" />
          <p className="text-xs uppercase tracking-wide opacity-90">Coupon applied</p>
          <p className="text-xl font-bold">Flat 10% Off</p>
          <span className="rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-medium">
            Already applied
          </span>
        </div>
      </div>

      <div className="absolute -right-6 -bottom-6 size-32 rounded-full bg-[var(--primary,#2874f0)]/10" />
      <div className="absolute top-4 right-1/3 size-16 rounded-full bg-white/30" />
    </section>
  );
}
