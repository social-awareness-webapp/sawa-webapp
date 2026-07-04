"use client";

import { useState } from "react";

import { RegisterWizard } from "@/components/shared/RegisterWizard";
import { registerUser } from "@/services/auth.service";
import type {
  RegisterDetailsFormData,
  RegisterStep,
  UserRole,
} from "@/types/auth";

export function RegisterContainer() {
  const [step, setStep] = useState<RegisterStep>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitDetails = async (data: RegisterDetailsFormData) => {
    if (!selectedRole) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: registerError } = await registerUser({
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      role: selectedRole,
    });

    if (registerError) {
      setError(registerError.message);
      setIsLoading(false);
      return;
    }

    setStep(3);
    setIsLoading(false);
  };

  return (
    <RegisterWizard
      step={step}
      selectedRole={selectedRole}
      onRoleSelect={setSelectedRole}
      onContinueFromRole={() => setStep(2)}
      onBackToRole={() => setStep(1)}
      onSubmitDetails={handleSubmitDetails}
      isLoading={isLoading}
      error={error}
    />
  );
}
