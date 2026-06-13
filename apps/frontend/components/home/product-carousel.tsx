"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { ProductCard } from "@/components/catalog/product-card";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

type ProductCarouselProps = {
  title: string;
  products: Product[];
  className?: string;
};

export function ProductCarousel({ title, products, className }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) {
    return null;
  }

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -el.clientWidth * 0.8 : el.clientWidth * 0.8;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section className={cn("rounded-sm bg-white py-4 shadow-sm", className)}>
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-lg font-medium text-[var(--text-primary,#212121)]">{title}</h2>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex size-8 items-center justify-center rounded-full border border-[var(--border,#e0e0e0)] bg-white text-[var(--text-primary,#212121)] hover:bg-[var(--surface,#f1f3f6)]"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex size-8 items-center justify-center rounded-full border border-[var(--border,#e0e0e0)] bg-white text-[var(--text-primary,#212121)] hover:bg-[var(--surface,#f1f3f6)]"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 2}
            className="w-[180px] shrink-0 shadow-none hover:shadow-sm"
          />
        ))}
      </div>
    </section>
  );
}
