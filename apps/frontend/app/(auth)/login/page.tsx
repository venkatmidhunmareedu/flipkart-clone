import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { LoginForm } from "@/components/auth/login-form";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-[750px] overflow-hidden rounded-sm bg-white shadow-md md:grid-cols-[38%_62%]">
        <section className="flex flex-col justify-between bg-[#2874f0] p-8 text-white md:p-10">
          <div>
            <h1 className="text-xl font-semibold leading-snug md:text-2xl">
              Looks like you&apos;re new here!
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              Sign up with your email to get started
            </p>
          </div>
          <div className="mt-8 hidden md:block">
            <svg viewBox="0 0 280 140" className="h-36 w-full" aria-hidden>
              <rect x="30" y="50" width="100" height="70" rx="6" fill="#1a5fd1" />
              <rect x="50" y="65" width="60" height="40" rx="4" fill="#ffe500" opacity="0.9" />
              <circle cx="200" cy="55" r="32" fill="#ffffff" opacity="0.2" />
              <circle cx="200" cy="55" r="18" fill="#ffffff" opacity="0.35" />
              <rect x="160" y="90" width="50" height="35" rx="4" fill="#fb641b" opacity="0.8" />
            </svg>
          </div>
        </section>

        <section className="flex flex-col justify-center p-8 md:p-10">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
