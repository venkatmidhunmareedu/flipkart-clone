import { AccountSidebar } from "@/components/account/account-sidebar";
import { WishlistPanel } from "@/components/wishlist/wishlist-panel";

export const dynamic = "force-dynamic";

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <AccountSidebar />
        <WishlistPanel />
      </div>
    </div>
  );
}
