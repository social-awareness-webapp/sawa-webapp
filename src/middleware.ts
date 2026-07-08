import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { AppRole } from "@/types/auth";

const dashboardPrefixes = ["/dashboard"];
const adminPrefixes = ["/admin"];
const composeCampaignPrefixes = ["/campaigns/new"];
const authRoutes = ["/login", "/register"];

function isAppRole(value: unknown): value is AppRole {
  return (
    value === "user" || value === "business_owner" || value === "super_admin"
  );
}

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isDashboardRoute(pathname: string) {
  return matchesPrefix(pathname, dashboardPrefixes);
}

function isAdminRoute(pathname: string) {
  return matchesPrefix(pathname, adminPrefixes);
}

function isComposeCampaignRoute(pathname: string) {
  return (
    matchesPrefix(pathname, composeCampaignPrefixes) ||
    (pathname.startsWith("/campaigns/") && pathname.endsWith("/edit"))
  );
}

function isAuthRoute(pathname: string) {
  return matchesPrefix(pathname, authRoutes);
}

function canAccessDashboard(role: AppRole) {
  return role === "user" || role === "business_owner";
}

function canAccessAdmin(role: AppRole) {
  return role === "super_admin";
}

function getAuthenticatedHome(role: AppRole) {
  return role === "super_admin" ? "/admin" : "/dashboard";
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user) {
    if (
      isDashboardRoute(pathname) ||
      isAdminRoute(pathname) ||
      isComposeCampaignRoute(pathname)
    ) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    return supabaseResponse;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = isAppRole(profile?.role) ? profile.role : undefined;

  if (isAuthRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = role ? getAuthenticatedHome(role) : "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (isDashboardRoute(pathname) && (!role || !canAccessDashboard(role))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/unauthorized";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (isAdminRoute(pathname) && (!role || !canAccessAdmin(role))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/unauthorized";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (isComposeCampaignRoute(pathname) && !role) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/unauthorized";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
