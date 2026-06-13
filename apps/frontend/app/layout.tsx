import type { Metadata } from "next";
import { Toaster } from "sonner";

import "./globals.css";
import QueryClientProviderWrapper from "@/components/query-client-provider";
import AuthSessionProvider from "@/components/session-provider";

export const metadata: Metadata = {
  title: "Flipkart Clone",
  description: "Flipkart-style e-commerce marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">
        <QueryClientProviderWrapper>
          <AuthSessionProvider>
            {children}
            <Toaster richColors position="top-center" />
          </AuthSessionProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
