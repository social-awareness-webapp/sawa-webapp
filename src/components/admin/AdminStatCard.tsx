import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AdminStatCardProps = {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  valueClassName?: string;
};

export function AdminStatCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconClassName,
  valueClassName,
}: AdminStatCardProps) {
  return (
    <Card className="border border-slate-100 bg-white p-5 shadow-sm ring-0">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-sm text-slate-500">{label}</p>
          <p className={cn("text-3xl font-bold text-[#1A365D]", valueClassName)}>
            {value}
          </p>
          {subtext ? <p className="text-xs text-slate-400">{subtext}</p> : null}
        </div>
        {Icon ? (
          <span
            className={cn(
              "grid size-10 place-items-center rounded-full bg-slate-50",
              iconClassName
            )}
          >
            <Icon className="size-5" />
          </span>
        ) : null}
      </div>
    </Card>
  );
}
