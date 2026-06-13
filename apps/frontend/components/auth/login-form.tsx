"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
      setError("Invalid email or password");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="relative">
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="flipkart-input-underline peer pt-4"
          placeholder=" "
        />
        <label
          htmlFor="email"
          className="pointer-events-none absolute left-0 top-0 text-xs text-[var(--text-secondary,#878787)] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-[var(--primary,#2874f0)]"
        >
          Enter Email
        </label>
      </div>

      <div className="relative">
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="flipkart-input-underline peer pt-4"
          placeholder=" "
        />
        <label
          htmlFor="password"
          className="pointer-events-none absolute left-0 top-0 text-xs text-[var(--text-secondary,#878787)] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-[var(--primary,#2874f0)]"
        >
          Enter Password
        </label>
      </div>

      {error ? (
        <p className="text-sm text-[var(--danger,#d32f2f)]" role="alert">
          {error}
        </p>
      ) : null}

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
        {loading ? "Signing in..." : "Login"}
      </button>

      <Link
        href="/register"
        className="flex h-12 w-full items-center justify-center rounded-sm border border-[var(--border,#e0e0e0)] bg-white text-sm font-medium text-[var(--primary,#2874f0)] shadow-sm hover:bg-[var(--surface,#f1f3f6)]"
      >
        New to Flipkart? Create an account
      </Link>

      <p className="text-center text-sm">
        <Link href="/forgot-password" className="text-[var(--primary,#2874f0)] hover:underline">
          Forgot password?
        </Link>
      </p>
    </form>
  );
}
