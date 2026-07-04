"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { RegisterForm } from "@/components/shared/RegisterForm";
import { registerUser } from "@/services/auth.service";
import type { RegisterFormData } from "@/types/auth";

export function RegisterContainer() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    const { error: registerError } = await registerUser({
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      role: data.role,
    });

    if (registerError) {
      setError(registerError.message);
      setIsLoading(false);
      return;
    }

    router.push("/login?registered=true");
  };

  return (
    <RegisterForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
};
