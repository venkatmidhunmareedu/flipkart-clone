import Image from "next/image";
import Link from "next/link";

import { StarRating } from "@/components/catalog/star-rating";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
  priority?: boolean;
  variant?: "grid" | "carousel";
};

export function ProductCard({
  product,
  className,
  priority = false,
  variant = "grid",
}: ProductCardProps) {
  const image = product.images[0] ?? "/placeholder-product.png";
  const upiOffer = Math.round(product.sellingPrice * 0.7);

  if (variant === "carousel") {
    return (
      <Link
        href={`/p/${product.slug}`}
        className={cn("group flex flex-col", className)}
      >
        <div className="relative mb-2 aspect-square w-full bg-[#f5f5f5]">
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="200px"
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className="object-contain p-2"
          />
          <div className="absolute bottom-1.5 left-1.5">
            <StarRating rating={product.rating} size="sm" />
          </div>
        </div>

        <h3 className="mb-1 line-clamp-1 text-[13px] leading-snug text-[var(--text-secondary,#878787)]">
          {product.title}
        </h3>

        <div className="flex flex-wrap items-baseline gap-1.5">
          {product.discountPercent > 0 && (
            <span className="text-xs text-[var(--text-secondary,#878787)] line-through">
              {formatPrice(product.mrp)}
            </span>
          )}
          <span className="text-sm font-semibold text-[var(--text-primary,#212121)]">
            {formatPrice(product.sellingPrice)}
          </span>
        </div>

        <p className="mt-0.5 text-[11px] font-medium text-[var(--primary,#2874f0)]">
          {formatPrice(upiOffer)} with UPI offer + more
        </p>
      </Link>
    );
  }

  const isHotDeal = product.discountPercent >= 50;

  return (
    <Link
      href={`/p/${product.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-sm bg-white p-3 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <WishlistButton productId={product.id} className="absolute top-2 right-2 z-10" />

      <div className="relative mx-auto mb-2 aspect-square w-full max-w-[180px]">
        <Image
          src={image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, 180px"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-contain p-1 transition-transform group-hover:scale-105"
        />
        <div className="absolute bottom-1 left-1">
          <StarRating rating={product.rating} size="sm" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h3 className="line-clamp-2 text-sm leading-snug text-[var(--text-primary,#212121)]">
          {product.title}
        </h3>

        <div className="mt-auto flex flex-wrap items-baseline gap-1.5">
          <span className="text-base font-semibold text-[var(--text-primary,#212121)]">
            {formatPrice(product.sellingPrice)}
          </span>
          {product.discountPercent > 0 && (
            <>
              <span className="text-xs text-[var(--text-secondary,#878787)] line-through">
                {formatPrice(product.mrp)}
              </span>
              <span className="text-xs font-semibold text-[var(--success,#388e3c)]">
                {Math.round(product.discountPercent)}% off
              </span>
            </>
          )}
        </div>

        <p className="text-[11px] font-medium text-[var(--primary,#2874f0)]">
          {formatPrice(upiOffer)} with Bank offer
        </p>

        {isHotDeal && (
          <span className="text-xs font-semibold text-[var(--success,#388e3c)]">Hot Deal</span>
        )}

        {product.isAssured && (
          <span className="text-[10px] font-medium text-[var(--text-secondary,#878787)]">
            Flipkart Assured
          </span>
        )}
      </div>
    </Link>
  );
}
