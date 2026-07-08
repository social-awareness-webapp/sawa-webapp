"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { LoginForm } from "@/components/shared/LoginForm";
import { loginUser, signInWithGoogle } from "@/services/auth.service";
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
      setIsLoading(false);
      return;
    }

    const redirect = searchParams.get("redirect") || "/dashboard";
    router.refresh();
    router.push(redirect);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    const redirect = searchParams.get("redirect") || "/dashboard";
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`;
    const { error: googleError } = await signInWithGoogle(redirectTo);

    if (googleError) {
      setError(googleError.message);
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
