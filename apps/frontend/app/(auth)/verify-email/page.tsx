import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { authOptions } from "@/lib/auth";

type VerifyEmailPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  const { email } = await searchParams;

  if (!email) {
    redirect("/register");
  }

  return (
    <AuthShell
      title="Verify email"
      heading="Almost there!"
      description="Enter the 6-digit OTP we sent to your email to activate your account and start shopping."
      cta={{ label: "Login", href: "/login" }}
    >
      <h2 className="mb-2 text-xl font-medium text-[var(--text-primary,#212121)]">Verify Email</h2>
      <p className="mb-6 text-sm text-[var(--text-secondary,#878787)]">
        Enter the 6-digit OTP sent to <span className="font-medium text-[var(--text-primary,#212121)]">{email}</span>
      </p>
      <VerifyEmailForm email={email} />
    </AuthShell>
  );
}
