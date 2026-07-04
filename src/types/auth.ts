export type RegisterFormData = {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: "user" | "business_owner";
};

export type AuthError = {
  message: string;
};
