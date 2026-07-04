import { FileText, Megaphone, UserPlus } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Create an Account",
    description:
      "Sign up as a community member or business owner to join the SAWA network.",
    icon: UserPlus,
  },
  {
    number: 2,
    title: "Submit a Campaign",
    description:
      "Share your cause with our team for review and approval before going live.",
    icon: FileText,
  },
  {
    number: 3,
    title: "Spread Awareness",
    description:
      "Rally your community, track progress, and amplify the impact of your campaign.",
    icon: Megaphone,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-[#2D3748]">How It Works</h2>
          <p className="mt-2 text-sm text-slate-500">
            Three simple steps to launch your awareness campaign.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center rounded-xl border border-slate-100 bg-white p-8 text-center shadow-sm"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-[#D69E2E] text-sm font-bold text-white">
                  {step.number}
                </div>
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#D69E2E]/10">
                  <Icon className="size-5 text-[#D69E2E]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#2D3748]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
