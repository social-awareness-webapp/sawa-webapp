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
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                  isActive || isCompleted
                    ? "bg-[#1A365D] text-white"
                    : "border border-slate-200 bg-white text-slate-400"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`hidden text-sm sm:inline ${
                  isActive
                    ? "font-semibold text-[#1A365D]"
                    : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div className="mx-3 h-px w-12 bg-slate-200 sm:w-20" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
