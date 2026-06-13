import { AccountSidebar } from "@/components/account/account-sidebar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-6 md:flex-row">
        <AccountSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
