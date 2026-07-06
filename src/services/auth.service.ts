import { createClient } from "@/lib/supabase/client";
import type { LoginFormData, RegisterFormData } from "@/types/auth";

type RegisterInput = Omit<RegisterFormData, "confirm_password">;

export async function registerUser(data: RegisterInput) {
  const supabase = createClient();

  return supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.full_name,
        role: data.role,
      },
    },
  });
}

export async function loginUser(data: LoginFormData) {
  const supabase = createClient();

  return supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
}

export async function signInWithGoogle(redirectTo: string) {
  const supabase = createClient();

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });
}

export async function resendVerificationEmail(email: string) {
  const supabase = createClient();

  return supabase.auth.resend({
    type: "signup",
    email,
  });
}

export async function logoutUser() {
  const supabase = createClient();

  return supabase.auth.signOut();
}
