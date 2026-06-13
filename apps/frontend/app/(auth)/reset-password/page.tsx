import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { authOptions } from "@/lib/auth";

type ResetPasswordPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  const { email } = await searchParams;

  if (!email) {
    redirect("/forgot-password");
  }

  return (
    <AuthShell
      title="Reset password"
      heading="Create a new password"
      description="Use the OTP from your email along with a strong new password to secure your account."
      cta={{ label: "Login", href: "/login" }}
    >
      <h2 className="mb-6 text-xl font-medium text-[var(--text-primary,#212121)]">Reset Password</h2>
      <ResetPasswordForm email={email} />
    </AuthShell>
  );
}
