import { Check } from "lucide-react";

import type { RegisterStep } from "@/types/auth";

const steps: { number: RegisterStep; label: string }[] = [
  { number: 1, label: "Choose Role" },
  { number: 2, label: "Your Details" },
  { number: 3, label: "Confirmed" },
];

type RegisterStepperProps = {
  currentStep: RegisterStep;
};

export function RegisterStepper({ currentStep }: RegisterStepperProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                  isCompleted
                    ? "bg-[#2C9E9E] text-white"
                    : isActive
                      ? "bg-[#1A365D] text-white"
                      : "border border-slate-200 bg-white text-slate-400"
                }`}
              >
                {isCompleted ? <Check className="size-3.5" /> : step.number}
              </div>
              <span
                className={`hidden text-sm sm:inline ${
                  isCompleted
                    ? "font-medium text-[#2C9E9E]"
                    : isActive
                      ? "font-semibold text-[#1A365D]"
                      : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div
                className={`mx-3 h-px w-12 sm:w-20 ${
                  step.number < currentStep ? "bg-[#2C9E9E]" : "bg-slate-200"
                }`}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
