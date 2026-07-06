import Link from "next/link";
import { Check } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RegisterConfirmationData } from "@/types/auth";

type RegisterConfirmedStepProps = RegisterConfirmationData & {
  onResendVerification: () => void;
  isResending: boolean;
  resendMessage: string | null;
};

export function RegisterConfirmedStep({
  first_name,
  email,
  onResendVerification,
  isResending,
  resendMessage,
}: RegisterConfirmedStepProps) {
  return (
    <Card className="rounded-2xl border border-slate-100 shadow-sm">
      <CardContent className="space-y-6 p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#2C9E9E]">
            <Check className="size-8 text-white" strokeWidth={3} />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-[#2D3748]">
              Account Created!
            </h1>
            <p className="text-sm leading-relaxed text-slate-500">
              Welcome to SAWA,{" "}
              <span className="font-semibold text-[#2D3748]">{first_name}</span>
              . We&apos;ve sent a verification email to{" "}
              <span className="font-semibold text-[#2D3748]">{email}</span>.
              Please verify your address to activate your account.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Didn&apos;t receive it?{" "}
          <button
            type="button"
            onClick={onResendVerification}
            disabled={isResending}
            className="text-[#2B6CB0] hover:underline disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend verification email"}
          </button>
        </p>

        {resendMessage ? (
          <p className="text-sm text-[#2C9E9E]">{resendMessage}</p>
        ) : null}

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full rounded-lg bg-[#1A365D] py-2.5 text-white hover:bg-[#2a4a7f]"
          )}
        >
          Go to Dashboard →
        </Link>
      </CardContent>
    </Card>
  );
}
