import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

async function resolvePostLoginPath(supabase: Awaited<ReturnType<typeof createClient>>) {
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
    await supabase.auth.signOut();
    return "/login";
  }

  if (data?.role === "super_admin") {
    return "/admin";
  }

  return "/dashboard";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const next =
        requestedNext && requestedNext !== "/"
          ? requestedNext
          : await resolvePostLoginPath(supabase);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
