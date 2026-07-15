"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";

import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type AdminRefreshButtonProps = {
  className?: string;
};

export function AdminRefreshButton({ className }: AdminRefreshButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const wasPendingRef = useRef(false);

  useEffect(() => {
    if (wasPendingRef.current && !isPending) {
      toast.success("Dashboard data refreshed.");
    }

    wasPendingRef.current = isPending;
  }, [isPending]);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <RefreshCw className="size-4" />
      )}
      {isPending ? "Refreshing..." : "Refresh"}
    </button>
  );
}
