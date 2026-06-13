"use client";

import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

type CartCountBadgeProps = {
  className?: string;
};

export function CartCountBadge({ className }: CartCountBadgeProps) {
  const { data } = useCart();
  const count = data?.summary.itemCount ?? 0;

  if (count <= 0) {
    return null;
  }

  return (
    <Badge
      className={cn(
        "absolute -top-2 -right-2 size-4 items-center justify-center rounded-full p-0 text-[10px]",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
