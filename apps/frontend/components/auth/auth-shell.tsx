import Link from "next/link";

type AuthShellProps = {
  title: string;
  heading: string;
  description: string;
  cta?: { label: string; href: string };
  children: React.ReactNode;
};

export function AuthShell({ title, heading, description, cta, children }: AuthShellProps) {
  return (
    <main className="flex min-h-[calc(100vh-0px)] items-center justify-center bg-[var(--surface,#f1f3f6)] px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-md bg-white shadow-md md:grid-cols-2">
        <section className="flex flex-col justify-center bg-[#2874f0] p-8 text-white md:p-10">
          <p className="text-sm uppercase tracking-wide text-white/80">{title}</p>
          <h1 className="mt-2 text-2xl font-semibold md:text-3xl">{heading}</h1>
          <p className="mt-3 max-w-sm text-sm text-white/90">{description}</p>
          <div className="mt-8 hidden h-40 items-end md:flex">
            <svg viewBox="0 0 240 120" className="h-full w-full opacity-90" aria-hidden>
              <rect x="20" y="40" width="80" height="60" rx="8" fill="#ffe500" />
              <circle cx="180" cy="50" r="28" fill="#ffffff" opacity="0.25" />
              <path d="M40 100h160" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          {cta ? (
            <Link
              href={cta.href}
              className="mt-8 inline-flex w-fit rounded border border-white px-5 py-2 text-sm font-medium hover:bg-white/10"
            >
              {cta.label}
            </Link>
          ) : null}
        </section>

        <section className="flex flex-col justify-center p-8 md:p-10">{children}</section>
      </div>
    </main>
  );
}
