import { Card } from "@/components/ui/card";
import type { ProfileActivity } from "@/types/profile";

type ProfileActivityCardProps = {
  activity: ProfileActivity;
};

export function ProfileActivityCard({ activity }: ProfileActivityCardProps) {
  const tiles = [
    { label: "Campaigns Posted", value: activity.posted },
    { label: "Campaigns Pending", value: activity.pending },
    { label: "Campaigns Approved", value: activity.approved },
  ];

  return (
    <Card className="border border-slate-100 bg-white p-6 shadow-sm ring-0">
      <h3 className="text-base font-semibold text-[#1A365D]">
        Campaign Activity
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-xl bg-slate-50 p-5 text-center"
          >
            <p className="text-3xl font-bold text-[#1A365D]">{tile.value}</p>
            <p className="mt-1 text-sm text-slate-500">{tile.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
