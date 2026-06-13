"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(6, " ").slice(0, 6).split("");

  function updateDigit(index: number, digit: string) {
    const next = digits.map((char, i) => (i === index ? digit : char === " " ? "" : char));
    onChange(next.join("").slice(0, 6));
  }

  function handleChange(index: number, nextValue: string) {
    const digit = nextValue.replace(/\D/g, "").slice(-1);
    updateDigit(index, digit);

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, 5);
    inputsRef.current[focusIndex]?.focus();
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          value={digits[index]?.trim() ?? ""}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className={cn(
            "h-12 w-10 rounded border border-[var(--border,#e0e0e0)] text-center text-lg font-semibold outline-none focus:border-[var(--primary,#2874f0)]",
            disabled && "opacity-50",
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
