"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { useToggleWishlist, useWishlistIds } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

type WishlistButtonProps = {
  productId: string;
  className?: string;
  iconClassName?: string;
  variant?: "overlay" | "inline";
};

export function WishlistButton({
  productId,
  className,
  iconClassName,
  variant = "overlay",
}: WishlistButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const { data: wishlistIds } = useWishlistIds();
  const toggleWishlist = useToggleWishlist();

  const isInWishlist = wishlistIds?.has(productId) ?? false;
  const isPending = toggleWishlist.isPending;

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (status !== "authenticated") {
      toast.error("Please log in to use your wishlist");
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    toggleWishlist.mutate({ productId, isInWishlist });
  }

  const baseClass =
    variant === "overlay"
      ? "rounded-full bg-white/90 p-1.5 shadow-sm"
      : "rounded-full border border-[var(--border,#e0e0e0)] p-2";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        baseClass,
        "z-10 transition-all hover:text-[var(--danger,#d32f2f)] disabled:opacity-50",
        isInWishlist
          ? "text-[var(--danger,#d32f2f)]"
          : "text-[var(--text-secondary,#878787)]",
        toggleWishlist.isSuccess && "animate-pulse",
        className,
      )}
    >
      <Heart
        className={cn(
          iconClassName ?? (variant === "inline" ? "size-5" : "size-4"),
          isInWishlist && "fill-current",
        )}
      />
    </button>
  );
}
