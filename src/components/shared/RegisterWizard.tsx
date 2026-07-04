import { RegisterConfirmedStep } from "@/components/shared/RegisterConfirmedStep";
import { RegisterDetailsStep } from "@/components/shared/RegisterDetailsStep";
import { RegisterStepper } from "@/components/shared/RegisterStepper";
import { RoleSelectionStep } from "@/components/shared/RoleSelectionStep";
import type {
  RegisterDetailsFormData,
  RegisterStep,
  UserRole,
} from "@/types/auth";

type RegisterWizardProps = {
  step: RegisterStep;
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
  onContinueFromRole: () => void;
  onBackToRole: () => void;
  onSubmitDetails: (data: RegisterDetailsFormData) => void;
  isLoading: boolean;
  error: string | null;
};

export function RegisterWizard({
  step,
  selectedRole,
  onRoleSelect,
  onContinueFromRole,
  onBackToRole,
  onSubmitDetails,
  isLoading,
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
      {step === 3 ? <RegisterConfirmedStep /> : null}
    </div>
  );
}
