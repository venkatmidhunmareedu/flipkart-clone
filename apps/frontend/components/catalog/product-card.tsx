import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { formatDiscount, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

import { StarRating } from "./star-rating";

type ProductCardProps = {
  product: Product;
  className?: string;
  priority?: boolean;
};

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const image = product.images[0] ?? "/placeholder-product.png";
  const isHotDeal = product.discountPercent >= 50;

  return (
    <Link
      href={`/p/${product.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-sm bg-white p-3 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <WishlistButton
        productId={product.id}
        className="absolute top-2 right-2"
      />

      {isHotDeal && (
        <Badge variant="accent" className="absolute top-2 left-2 z-10 text-[10px] font-bold">
          Hot Deal
        </Badge>
      )}

      <div className="relative mx-auto mb-3 aspect-square w-full max-w-[180px]">
        <Image
          src={image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, 180px"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-contain transition-transform group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <StarRating rating={product.rating} />

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
              <span className="text-xs font-medium text-[var(--success,#388e3c)]">
                {formatDiscount(product.mrp, product.sellingPrice)}
              </span>
            </>
          )}
        </div>

        {product.isAssured && (
          <span className="text-[10px] font-medium text-[var(--text-secondary,#878787)]">
            Flipkart Assured
          </span>
        )}
      </div>
    </Link>
  );
}
