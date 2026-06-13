import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { authOptions } from "@/lib/auth";

export default async function ForgotPasswordPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <AuthShell
      title="Forgot password"
      heading="Need a reset?"
      description="Enter your registered email and we will send a one-time code to help you set a new password."
      cta={{ label: "Login", href: "/login" }}
    >
      <h2 className="mb-6 text-xl font-medium text-[var(--text-primary,#212121)]">Forgot Password</h2>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
