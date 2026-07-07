"use client";

import { useState } from "react";

import { RegisterWizard } from "@/components/shared/RegisterWizard";
import { registerUser, resendVerificationEmail } from "@/services/auth.service";
import type {
  RegisterConfirmationData,
  RegisterDetailsFormData,
  RegisterStep,
  UserRole,
} from "@/types/auth";

export function RegisterContainer() {
  const [step, setStep] = useState<RegisterStep>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [confirmation, setConfirmation] =
    useState<RegisterConfirmationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitDetails = async (data: RegisterDetailsFormData) => {
    if (!selectedRole) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: registerError } = await registerUser({
      full_name: `${data.first_name} ${data.last_name}`.trim(),
      email: data.email,
      password: data.password,
      role: selectedRole,
    });

    if (registerError) {
      setError(registerError.message);
      setIsLoading(false);
      return;
    }

    setConfirmation({
      first_name: data.first_name,
      email: data.email,
    });
    setStep(3);
    setIsLoading(false);
  };

  const handleResendVerification = async () => {
    if (!confirmation) {
      return;
    }

    setIsResending(true);
    setResendMessage(null);

    const { error: resendError } = await resendVerificationEmail(
      confirmation.email
    );

    if (resendError) {
      setResendMessage(resendError.message);
      setIsResending(false);
      return;
    }

    setResendMessage("Verification email sent. Please check your inbox.");
    setIsResending(false);
  };

  return (
    <RegisterWizard
      step={step}
      selectedRole={selectedRole}
      confirmation={confirmation}
      onRoleSelect={setSelectedRole}
      onContinueFromRole={() => setStep(2)}
      onBackToRole={() => setStep(1)}
      onSubmitDetails={handleSubmitDetails}
      onResendVerification={handleResendVerification}
      isLoading={isLoading}
      isResending={isResending}
      resendMessage={resendMessage}
      error={error}
    />
  );
}
