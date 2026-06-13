"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const result = await apiFetch<{ sent: boolean }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }

    toast.success("Reset code sent to your email");
    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <FormField id="email" label="Email">
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your registered email"
        />
      </FormField>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-[#fb641b] text-white hover:bg-[#e85a17]"
      >
        {loading ? "Sending..." : "Send Reset Code"}
      </Button>

      <p className="text-center text-sm">
        <Link href="/login" className="text-[var(--primary,#2874f0)] hover:underline">
          Back to Login
        </Link>
      </p>
    </form>
  );
}
