import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { authOptions } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <AuthShell
      title="Join us"
      heading="Looks like you're new here!"
      description="Sign up with your email to get exclusive offers, personalized recommendations, and a faster checkout experience."
      cta={{ label: "Login", href: "/login" }}
    >
      <h2 className="mb-6 text-xl font-medium text-[var(--text-primary,#212121)]">Create Account</h2>
      <RegisterForm />
    </AuthShell>
  );
}
