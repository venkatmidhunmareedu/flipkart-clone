"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { OtpInput } from "@/components/auth/otp-input";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

type ResetPasswordFormProps = {
  email: string;
};

export function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);

    if (code.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFieldError("Passwords do not match");
      return;
    }

    setLoading(true);

    const result = await apiFetch<{ reset: boolean }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, code, newPassword }),
    });

    setLoading(false);

    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }

    toast.success("Password reset successfully");
    router.push("/login");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="text-center">
        <p className="text-sm text-[var(--text-secondary,#878787)]">OTP sent to</p>
        <p className="text-sm font-medium text-[var(--text-primary,#212121)]">{email}</p>
      </div>

      <OtpInput value={code} onChange={setCode} disabled={loading} />

      <FormField id="newPassword" label="New Password">
        <Input
          id="newPassword"
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Enter new password"
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
          placeholder="Confirm new password"
        />
      </FormField>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-[#fb641b] text-white hover:bg-[#e85a17]"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </Button>

      <p className="text-center text-sm">
        <Link href="/login" className="text-[var(--primary,#2874f0)] hover:underline">
          Back to Login
        </Link>
      </p>
    </form>
  );
}
