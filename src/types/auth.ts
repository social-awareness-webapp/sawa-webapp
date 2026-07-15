export type UserRole = "user" | "business_owner";

export type AppRole = UserRole | "super_admin";

export type RegisterStep = 1 | 2 | 3;

export type RegisterFormData = {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: UserRole;
};

export type RegisterDetailsFormData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  accept_terms: boolean;
};

export type RegisterConfirmationData = {
  first_name: string;
  email: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type AuthError = {
  message: string;
};
