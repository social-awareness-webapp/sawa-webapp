import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function RegisterConfirmedStep() {
  return (
    <Card className="border border-slate-100 shadow-sm">
      <CardContent className="space-y-6 p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="size-8 text-green-600" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#1A365D]">
              Account Created!
            </h1>
            <p className="text-sm text-slate-500">
              Your SAWA account has been created successfully. Sign in to get
              started.
            </p>
          </div>
        </div>
        <Link href="/login" className="block">
          <Button
            type="button"
            className="w-full rounded-lg bg-[#1A365D] py-2.5 text-white hover:bg-[#2a4a7f]"
          >
            Sign In →
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
