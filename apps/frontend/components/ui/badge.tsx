import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary,#2874f0)] text-white",
        secondary: "bg-[var(--surface,#f1f3f6)] text-[var(--text-primary,#212121)]",
        success: "bg-[var(--success,#388e3c)] text-white",
        danger: "bg-[var(--danger,#d32f2f)] text-white",
        accent: "bg-[var(--accent,#ffe500)] text-[var(--text-primary,#212121)]",
        outline: "border border-[var(--border,#e0e0e0)] text-[var(--text-primary,#212121)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
