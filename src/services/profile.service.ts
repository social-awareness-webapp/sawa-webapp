import { createClient } from "@/lib/supabase/client";
import type { ChangePasswordInput, UpdateProfileInput } from "@/types/profile";

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput
): Promise<{ fullName: string }> {
  const supabase = createClient();

  const fullName = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();

  const { error } = await supabase
    .from("users")
    .update({
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      full_name: fullName,
      phone: input.phone.trim() || null,
      location: input.location.trim() || null,
      bio: input.bio.trim() || null,
    })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }

  // Keep auth metadata in sync so the display name stays consistent. Best
  // effort: a failure here should not block the profile save.
  try {
    await supabase.auth.updateUser({ data: { full_name: fullName } });
  } catch {
    // ignore
  }

  return { fullName };
}

export async function changePassword({
  email,
  currentPassword,
  newPassword,
}: ChangePasswordInput): Promise<void> {
  if (currentPassword === newPassword) {
    throw new Error(
      "Your new password must be different from your current password."
    );
  }

  const supabase = createClient();

  // Verify the current password by re-authenticating. This also protects
  // against changing the password of a stale/hijacked session.
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (verifyError) {
    throw new Error("Your current password is incorrect.");
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    throw new Error(error.message);
  }
}

export async function archiveAccount(userId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("users")
    .update({ is_archived: true })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.auth.signOut();
}

export async function isCurrentUserArchived(): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data } = await supabase
    .from("users")
    .select("is_archived")
    .eq("id", user.id)
    .single();

  return Boolean((data as { is_archived: boolean | null } | null)?.is_archived);
}
