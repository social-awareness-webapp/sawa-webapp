import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PublicNavbarAuthActionsProps = {
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  onLogout: () => void;
};

export function PublicNavbarAuthActions({
  isAuthenticated,
  isLoggingOut,
  onLogout,
}: PublicNavbarAuthActionsProps) {
  if (isAuthenticated) {
    return (
      <Button
        type="button"
        variant="ghost"
        className="text-[#1A365D] hover:bg-[#1A365D]/5"
        onClick={onLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Log Out"}
      </Button>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "text-[#1A365D] hover:bg-[#1A365D]/5"
        )}
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className={cn(
          buttonVariants({ variant: "default" }),
          "bg-[#1A365D] text-white hover:bg-[#2a4a7f]"
        )}
      >
        Get Started
      </Link>
    </>
  );
}
