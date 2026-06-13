"use client";

import { ChevronRight } from "lucide-react";
import { useRef } from "react";

import { ProductCard } from "@/components/catalog/product-card";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

type ProductCarouselProps = {
  title: string;
  products: Product[];
  className?: string;
  variant?: "default" | "sale";
};

export function ProductCarousel({
  title,
  products,
  className,
  variant = "default",
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) {
    return null;
  }

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }

  if (variant === "sale") {
    return (
      <section className={cn("overflow-hidden rounded-sm bg-white shadow-sm", className)}>
        <div className="flex items-center justify-between bg-[var(--primary,#2874f0)] px-4 py-2.5 text-white">
          <h2 className="text-base font-medium">{title}</h2>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="View all"
            className="flex size-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scroll-smooth px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 2}
                variant="carousel"
                className="w-[180px] shrink-0 border border-transparent shadow-none hover:border-[var(--border,#e0e0e0)] hover:shadow-sm"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("bg-white", className)}>
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-[17px] font-semibold text-[var(--text-primary,#212121)]">{title}</h2>
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="View all"
          className="flex size-7 items-center justify-center rounded-full bg-[var(--text-primary,#212121)] text-white hover:bg-[#424242]"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-0 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
              variant="carousel"
              className="w-[200px] shrink-0 rounded-none border-0 bg-white p-3 shadow-none hover:shadow-none"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute top-[38%] right-2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#e0e0e0]/90 text-[var(--text-primary,#212121)] shadow-sm hover:bg-[#d0d0d0]"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  );
}
