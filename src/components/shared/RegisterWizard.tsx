import { RegisterConfirmedStep } from "@/components/shared/RegisterConfirmedStep";
import { RegisterDetailsStep } from "@/components/shared/RegisterDetailsStep";
import { RegisterStepper } from "@/components/shared/RegisterStepper";
import { RoleSelectionStep } from "@/components/shared/RoleSelectionStep";
import type {
  RegisterConfirmationData,
  RegisterDetailsFormData,
  RegisterStep,
  UserRole,
} from "@/types/auth";

type RegisterWizardProps = {
  step: RegisterStep;
  selectedRole: UserRole | null;
  confirmation: RegisterConfirmationData | null;
  onRoleSelect: (role: UserRole) => void;
  onContinueFromRole: () => void;
  onBackToRole: () => void;
  onSubmitDetails: (data: RegisterDetailsFormData) => void;
  onResendVerification: () => void;
  isLoading: boolean;
  isResending: boolean;
  resendMessage: string | null;
  error: string | null;
};

export function RegisterWizard({
  step,
  selectedRole,
  confirmation,
  onRoleSelect,
  onContinueFromRole,
  onBackToRole,
  onSubmitDetails,
  onResendVerification,
  isLoading,
  isResending,
  resendMessage,
  error,
}: RegisterWizardProps) {
  return (
    <div className="space-y-8">
      <RegisterStepper currentStep={step} />
      {step === 1 ? (
        <RoleSelectionStep
          selectedRole={selectedRole}
          onRoleSelect={onRoleSelect}
          onContinue={onContinueFromRole}
        />
      ) : null}
      {step === 2 && selectedRole ? (
        <RegisterDetailsStep
          role={selectedRole}
          onSubmit={onSubmitDetails}
          onBack={onBackToRole}
          isLoading={isLoading}
          error={error}
        />
      ) : null}
      {step === 3 && confirmation ? (
        <RegisterConfirmedStep
          first_name={confirmation.first_name}
          email={confirmation.email}
          onResendVerification={onResendVerification}
          isResending={isResending}
          resendMessage={resendMessage}
        />
      ) : null}
    </div>
  );
}
