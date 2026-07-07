import { Briefcase, ShieldCheck, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserRole } from "@/types/auth";

const roleOptions: {
  value: UserRole;
  title: string;
  description: string;
  icon: typeof User;
}[] = [
  {
    value: "user",
    title: "Community Member",
    description: "Browse and support social awareness campaigns.",
    icon: User,
  },
  {
    value: "business_owner",
    title: "Small Business Owner",
    description: "Sponsor campaigns and launch branded awareness drives.",
    icon: Briefcase,
  },
];

type RoleSelectionStepProps = {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
  onContinue: () => void;
};

export function RoleSelectionStep({
  selectedRole,
  onRoleSelect,
  onContinue,
}: RoleSelectionStepProps) {
  return (
    <Card className="border border-slate-100 shadow-sm">
      <CardContent className="space-y-6 p-8">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-[#1A365D]">
            How will you use SAWA?
          </h1>
          <p className="text-sm text-slate-500">
            Select the role that best describes you.
          </p>
        </div>

        <div className="space-y-3">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedRole === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onRoleSelect(option.value)}
                className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors ${
                  isSelected
                    ? "border-[#1A365D] bg-[#1A365D]/5 ring-1 ring-[#1A365D]"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <Icon className="size-5 text-slate-600" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-[#2D3748]">{option.title}</p>
                  <p className="text-sm text-slate-500">{option.description}</p>
                </div>
              </button>
            );
          })}

          <div className="flex w-full cursor-not-allowed items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 opacity-60">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <ShieldCheck className="size-5 text-slate-400" />
            </div>
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-400">
                Administrator (Invite only)
              </p>
              <p className="text-sm text-slate-400">
                Manage campaigns and users. Invite only.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          className="w-full rounded-lg bg-[#1A365D] py-2.5 text-white hover:bg-[#2a4a7f] disabled:bg-slate-300 disabled:text-white disabled:opacity-100"
          disabled={!selectedRole}
          onClick={onContinue}
        >
          Continue →
        </Button>
      </CardContent>
    </Card>
  );
}
