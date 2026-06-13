import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded border border-[var(--border,#e0e0e0)] bg-white px-3 py-2 text-sm text-[var(--text-primary,#212121)] outline-none transition-colors placeholder:text-[var(--text-secondary,#878787)] focus:border-[var(--primary,#2874f0)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  error?: string | null;
  children: React.ReactNode;
};

function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-[var(--text-primary,#212121)]">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-sm text-[var(--danger,#d32f2f)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Input, FormField };
