import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware — route protection.
 *
 * /dashboard/* → requires any authenticated session
 * /admin/*     → requires auth (full role check happens in the page/action itself
 *                against the DB — middleware only checks for session cookie presence)
 *
 * The actual admin role check is always done server-side in the page or Server Action
 * against the profiles table, so even if the cookie is forged/replayed,
 * the DB-level role check will deny access.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtected && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
