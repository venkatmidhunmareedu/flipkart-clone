"use client";

import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

type CartCountBadgeProps = {
  className?: string;
  alwaysShow?: boolean;
};

export function CartCountBadge({ className, alwaysShow = false }: CartCountBadgeProps) {
  const { data } = useCart();
  const count = data?.summary.itemCount ?? 0;

  if (!alwaysShow && count <= 0) {
    return null;
  }

  return (
    <Badge
      variant="danger"
      className={cn(
        "absolute -top-2 -right-2 size-[18px] min-w-[18px] items-center justify-center rounded-full p-0 text-[10px] font-semibold",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
