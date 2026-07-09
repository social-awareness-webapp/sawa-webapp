"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";

import { getInitials } from "@/lib/user";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/services/auth.service";
import { toast } from "@/lib/toast";

type AdminHeaderProps = {
  displayName: string;
};

export function AdminHeader({ displayName }: AdminHeaderProps) {
  const router = useRouter();
  const initials = getInitials(displayName);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    const { error } = await logoutUser();

    if (error) {
      toast.error(error.message);
      setIsLoggingOut(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B1F3A]">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 md:hidden">
          <span className="text-lg font-bold text-white">SAWA Admin</span>
        </div>

        <div className="hidden flex-1 justify-center md:flex" />

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-white/10"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-white sm:inline">
              {displayName}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-white/60 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {isOpen ? (
            <>
              <div
                className="fixed inset-0 z-40"
                aria-hidden
                onClick={() => setIsOpen(false)}
              />
              <div
                role="menu"
                className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-slate-100 bg-white py-1 shadow-lg"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[#2D3748] transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  <LogOut className="size-4 text-slate-400" />
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
