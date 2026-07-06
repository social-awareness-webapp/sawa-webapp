import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="bg-[#2B6CB0] py-14 text-center text-white">
      <div className="mx-auto max-w-2xl space-y-4 px-4">
        <h2 className="text-3xl font-bold">Ready to Make a Difference?</h2>
        <Link
          href="/register"
          className={cn(
            buttonVariants({ variant: "default" }),
            "rounded-lg bg-[#D69E2E] px-8 py-2.5 text-white hover:bg-[#D69E2E]/90"
          )}
        >
          Get Started Free
        </Link>
        <p className="text-sm text-white/80">
          No credit card required. Always free for community members.
        </p>
      </div>
    </section>
  );
}
