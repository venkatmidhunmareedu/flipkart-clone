/** Format paise amount as INR currency string */
export function formatPaise(paise: number): string {
  return formatPrice(paise / 100);
}

/** Format rupee amount (from API) as INR currency string, e.g. ₹1,499 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Compute discount label from MRP and selling price in rupees */
export function formatDiscount(mrp: number, sellingPrice: number): string {
  if (mrp <= 0) return "0% off";
  const pct = Math.round(((mrp - sellingPrice) / mrp) * 100);
  return `${pct}% off`;
}
