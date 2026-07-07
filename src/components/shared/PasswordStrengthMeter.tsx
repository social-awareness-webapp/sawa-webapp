type PasswordStrengthResult = {
  filledSegments: number;
  label: string;
  labelClassName: string;
  segmentClassName: string;
};

export function getPasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      filledSegments: 0,
      label: "",
      labelClassName: "",
      segmentClassName: "bg-slate-200",
    };
  }

  let score = 0;

  if (password.length >= 8) {
    score++;
  }
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  }
  if (/\d/.test(password)) {
    score++;
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    score++;
  }

  if (password.length < 8) {
    return {
      filledSegments: 1,
      label: "Too short — minimum 8 characters",
      labelClassName: "text-red-500",
      segmentClassName: "bg-red-400",
    };
  }

  if (score <= 2) {
    return {
      filledSegments: 2,
      label: "Fair — add numbers or symbols to strengthen",
      labelClassName: "text-orange-500",
      segmentClassName: "bg-orange-400",
    };
  }

  if (score === 3) {
    return {
      filledSegments: 3,
      label: "Good — almost there",
      labelClassName: "text-yellow-600",
      segmentClassName: "bg-yellow-500",
    };
  }

  return {
    filledSegments: 4,
    label: "Strong password",
    labelClassName: "text-[#2C9E9E]",
    segmentClassName: "bg-[#2C9E9E]",
  };
}

type PasswordStrengthMeterProps = {
  password: string;
};

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = getPasswordStrength(password);

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full ${
              index < strength.filledSegments
                ? strength.segmentClassName
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${strength.labelClassName}`}>{strength.label}</p>
    </div>
  );
}
