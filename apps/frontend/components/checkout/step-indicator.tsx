import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type CheckoutStep = 1 | 2 | 3;

const STEPS = [
  { number: 1, label: "Address" },
  { number: 2, label: "Order Summary" },
  { number: 3, label: "Payment" },
] as const;

type StepIndicatorProps = {
  currentStep: CheckoutStep;
};

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-center overflow-x-auto bg-white px-2 py-4 sm:px-4">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-sm font-semibold",
                  isCompleted && "bg-[var(--primary,#2874f0)] text-white",
                  isActive && "bg-[var(--primary,#2874f0)] text-white",
                  !isCompleted && !isActive && "bg-[var(--surface,#f1f3f6)] text-[var(--text-secondary,#878787)]",
                )}
              >
                {isCompleted ? <Check className="size-4" /> : step.number}
              </div>
              <span
                className={cn(
                  "mt-1 text-xs",
                  isActive || isCompleted
                    ? "font-semibold text-[var(--primary,#2874f0)]"
                    : "text-[var(--text-secondary,#878787)]",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 mb-5 h-0.5 w-8 sm:mx-3 sm:w-24",
                  currentStep > step.number
                    ? "bg-[var(--primary,#2874f0)]"
                    : "bg-[var(--border,#e0e0e0)]",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
