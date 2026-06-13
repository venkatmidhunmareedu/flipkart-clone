import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
};

export function StarRating({
  rating,
  size = "sm",
  showValue = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const starSize = size === "sm" ? "size-3" : "size-4";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center rounded-sm bg-[var(--success,#388e3c)] px-1 py-0.5 text-white">
        <span className={cn("font-medium", size === "sm" ? "text-[10px]" : "text-xs")}>
          {rating.toFixed(1)}
        </span>
        <Star className={cn(starSize, "fill-white")} />
      </div>
      {showValue && reviewCount !== undefined && (
        <span className="text-xs text-[var(--text-secondary,#878787)]">
          ({reviewCount.toLocaleString("en-IN")})
        </span>
      )}
    </div>
  );
}
