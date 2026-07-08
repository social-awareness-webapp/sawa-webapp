import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingScreenProps = {
  label?: string;
  className?: string;
};

export function LoadingScreen({
  label = "Loading...",
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 text-slate-500",
        className
      )}
    >
      <Loader2 className="size-6 animate-spin text-[#2B6CB0]" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
