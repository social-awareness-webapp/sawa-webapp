import { HelpCircle } from "lucide-react";

export function DashboardHelpButton() {
  return (
    <button
      type="button"
      aria-label="Help and support"
      className="fixed right-6 bottom-6 z-20 grid size-11 place-items-center rounded-full bg-[#1A365D] text-white shadow-lg transition-colors hover:bg-[#2a4a7f]"
    >
      <HelpCircle className="size-5" />
    </button>
  );
}
