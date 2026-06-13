"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

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
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#212121]">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded border border-[#e0e0e0] px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
          placeholder="Enter Email"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-[#212121]">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded border border-[#e0e0e0] px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
          placeholder="Enter Password"
        />
      </div>

      {error ? (
        <p className="text-sm text-[#d32f2f]" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-[#fb641b] text-white hover:bg-[#e85a17]"
      >
        {loading ? "Signing in..." : "Login"}
      </Button>

      <p className="text-center text-sm text-[#878787]">
        New to Flipkart?{" "}
        <Link href="/register" className="font-medium text-[#2874f0] hover:underline">
          Create an account
        </Link>
      </p>

      <p className="text-center text-sm">
        <Link href="/forgot-password" className="text-[#2874f0] hover:underline">
          Forgot password?
        </Link>
      </p>
    </form>
  );
}
