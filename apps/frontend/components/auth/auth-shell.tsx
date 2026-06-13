import Link from "next/link";

type AuthShellProps = {
  title?: string;
  heading: string;
  description: string;
  cta?: { label: string; href: string };
  children: React.ReactNode;
};

export function AuthShell({ heading, description, cta, children }: AuthShellProps) {
  return (
    <main className="flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-[750px] overflow-hidden rounded-sm bg-white shadow-md md:grid-cols-[38%_62%]">
        <section className="flex flex-col justify-between bg-[#2874f0] p-8 text-white md:p-10">
          <div>
            <h1 className="text-xl font-semibold leading-snug md:text-2xl">{heading}</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/90">{description}</p>
          </div>
          <div className="mt-8 hidden md:block">
            <svg viewBox="0 0 280 140" className="h-36 w-full" aria-hidden>
              <rect x="30" y="50" width="100" height="70" rx="6" fill="#1a5fd1" />
              <rect x="50" y="65" width="60" height="40" rx="4" fill="#ffe500" opacity="0.9" />
              <circle cx="200" cy="55" r="32" fill="#ffffff" opacity="0.2" />
              <circle cx="200" cy="55" r="18" fill="#ffffff" opacity="0.35" />
              <rect x="160" y="90" width="50" height="35" rx="4" fill="#fb641b" opacity="0.8" />
              <path d="M40 120h200" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
            </svg>
          </div>
          {cta ? (
            <Link
              href={cta.href}
              className="mt-6 inline-flex w-full items-center justify-center rounded-sm border border-white/60 bg-transparent px-5 py-3 text-sm font-medium text-white hover:bg-white/10 md:mt-0"
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
