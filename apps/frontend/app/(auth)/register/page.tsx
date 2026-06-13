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
      heading="Looks like you're new here!"
      description="Sign up with your email to get started"
      cta={{ label: "Existing User? Log in", href: "/login" }}
    >
      <RegisterForm />
    </AuthShell>
  );
}
