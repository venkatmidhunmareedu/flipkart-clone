"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { FormField, Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

export function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);

    if (password !== confirmPassword) {
      setFieldError("Passwords do not match");
      return;
    }

    setLoading(true);

    const result = await apiFetch<{ user: { email: string } }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName: lastName || undefined,
        email,
        password,
      }),
    });

    setLoading(false);

    if (!result.ok) {
      toast.error(result.error.message);
      setFieldError(result.error.message);
      return;
    }

    toast.success("Account created. Check your email for the OTP.");
    router.push(`/verify-email?email=${encodeURIComponent(result.data.user.email)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <FormField id="firstName" label="First Name">
        <Input
          id="firstName"
          required
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="Enter First Name"
          className="rounded-sm border-[var(--border,#e0e0e0)]"
        />
      </FormField>

      <FormField id="lastName" label="Last Name">
        <Input
          id="lastName"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          placeholder="Enter Last Name"
          className="rounded-sm border-[var(--border,#e0e0e0)]"
        />
      </FormField>

      <FormField id="email" label="Email">
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter Email"
          className="rounded-sm border-[var(--border,#e0e0e0)]"
        />
      </FormField>

      <FormField id="password" label="Password">
        <Input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter Password"
          className="rounded-sm border-[var(--border,#e0e0e0)]"
        />
      </FormField>

      <FormField id="confirmPassword" label="Confirm Password" error={fieldError}>
        <Input
          id="confirmPassword"
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm Password"
          className="rounded-sm border-[var(--border,#e0e0e0)]"
        />
      </FormField>

      <p className="text-xs leading-relaxed text-[var(--text-secondary,#878787)]">
        By continuing, you agree to Flipkart&apos;s{" "}
        <span className="text-[var(--primary,#2874f0)]">Terms of Use</span> and{" "}
        <span className="text-[var(--primary,#2874f0)]">Privacy Policy</span>.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-sm bg-[var(--flipkart-orange,#fb641b)] text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#e85a17] disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Continue"}
      </button>

      <Link
        href="/login"
        className="flex h-12 w-full items-center justify-center rounded-sm border border-[var(--border,#e0e0e0)] bg-white text-sm font-medium text-[var(--primary,#2874f0)] shadow-sm hover:bg-[var(--surface,#f1f3f6)]"
      >
        Existing User? Log in
      </Link>
    </form>
  );
}
