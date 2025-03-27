import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const isPublicPath = pathname === "/login" || pathname === "/register";

  // If logged in and trying to access a public path, redirect to home
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If not logged in and trying to access a protected path, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Matcher configuration for middleware
export const config = {
  matcher: ["/", "/login", "/register", "/profile", "/events/:path*"],
};
