"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { LoginForm } from "@/components/shared/LoginForm";
import { getPostLoginRedirect } from "@/lib/auth/get-post-login-redirect";
import {
  loginUser,
  logoutUser,
  signInWithGoogle,
} from "@/services/auth.service";
import { isCurrentUserArchived } from "@/services/profile.service";
import { toast } from "@/lib/toast";
import type { LoginFormData } from "@/types/auth";

export function LoginContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const successMessage =
    searchParams.get("registered") === "true"
      ? "Your account has been created. Please sign in."
      : null;

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    const { error: loginError } = await loginUser(data);

    if (loginError) {
      setError(loginError.message);
      toast.error(loginError.message);
      setIsLoading(false);
      return;
    }

    if (await isCurrentUserArchived()) {
      await logoutUser();
      const message =
        "This account has been deleted and can no longer be accessed.";
      setError(message);
      toast.error(message);
      setIsLoading(false);
      return;
    }

    const redirect =
      searchParams.get("redirect") ||
      (await getPostLoginRedirect("/dashboard"));
    router.push(redirect);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    const redirect =
      searchParams.get("redirect") ||
      (await getPostLoginRedirect("/dashboard"));
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`;
    const { error: googleError } = await signInWithGoogle(redirectTo);

    if (googleError) {
      setError(googleError.message);
      toast.error(googleError.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      onGoogleSignIn={handleGoogleSignIn}
      isLoading={isLoading}
      isGoogleLoading={isGoogleLoading}
      error={error}
      successMessage={successMessage}
    />
  );
}
