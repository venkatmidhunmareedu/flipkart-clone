"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <FormField id="firstName" label="First Name">
        <Input
          id="firstName"
          required
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="Enter First Name"
        />
      </FormField>

      <FormField id="lastName" label="Last Name">
        <Input
          id="lastName"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          placeholder="Enter Last Name"
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
        />
      </FormField>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-[#fb641b] text-white hover:bg-[#e85a17]"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </Button>

      <p className="text-center text-sm text-[var(--text-secondary,#878787)]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[var(--primary,#2874f0)] hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
