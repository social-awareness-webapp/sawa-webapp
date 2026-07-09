import { createClient } from "@/lib/supabase/client";

export async function getPostLoginRedirect(fallback = "/dashboard") {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "/login";
  }

  const { data } = await supabase
    .from("users")
    .select("role, is_archived")
    .eq("id", user.id)
    .single<{ role: string | null; is_archived: boolean | null }>();

  if (data?.is_archived) {
    return "/login";
  }

  if (data?.role === "super_admin") {
    return "/admin";
  }

  return fallback;
}
