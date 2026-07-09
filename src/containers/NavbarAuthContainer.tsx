"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PublicNavbarAuthActions } from "@/components/shared/PublicNavbarAuthActions";
import { useAuth } from "@/providers/AuthProvider";
import { logoutUser } from "@/services/auth.service";
import { toast } from "@/lib/toast";

export function NavbarAuthContainer() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    const { error } = await logoutUser();

    if (error) {
      toast.error(error.message);
      setIsLoggingOut(false);
      return;
    }

    router.refresh();
    router.push("/");
    setIsLoggingOut(false);
  };

  return (
    <PublicNavbarAuthActions
      isAuthenticated={isAuthenticated}
      isLoggingOut={isLoggingOut}
      onLogout={handleLogout}
    />
  );
}
