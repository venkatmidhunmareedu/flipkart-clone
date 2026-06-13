"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { OtpInput } from "@/components/auth/otp-input";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

type VerifyEmailFormProps = {
  email: string;
};

export function VerifyEmailForm({ email }: VerifyEmailFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(60);

  useEffect(() => {
    if (resendSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (code.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }

    setLoading(true);

    const result = await apiFetch<{ verified: boolean }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });

    setLoading(false);

    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }

    toast.success("Email verified successfully");
    router.push("/login");
  }

  async function handleResend() {
    if (resendSeconds > 0) {
      return;
    }

    const result = await apiFetch<{ sent: boolean }>("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }

    toast.success("OTP sent again");
    setResendSeconds(60);
  }

  return (
    <form onSubmit={handleVerify} className="flex w-full max-w-sm flex-col items-center gap-6">
      <OtpInput value={code} onChange={setCode} disabled={loading} />

      <Button
        type="submit"
        disabled={loading || code.length !== 6}
        className="h-11 w-full bg-[#fb641b] text-white hover:bg-[#e85a17]"
      >
        {loading ? "Verifying..." : "Verify Email"}
      </Button>

      <button
        type="button"
        onClick={handleResend}
        disabled={resendSeconds > 0}
        className="text-sm text-[var(--primary,#2874f0)] disabled:cursor-not-allowed disabled:text-[var(--text-secondary,#878787)]"
      >
        {resendSeconds > 0 ? `Resend OTP in ${resendSeconds}s` : "Resend OTP"}
      </button>

      <Link href="/login" className="text-sm text-[var(--primary,#2874f0)] hover:underline">
        Back to Login
      </Link>
    </form>
  );
}
