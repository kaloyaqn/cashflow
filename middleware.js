import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  // Retrieve token from NextAuth using your secret (set NEXTAUTH_SECRET in your .env.local)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // If the user is trying to access any route under /dashboard and is not authenticated, redirect to /login
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow the request to continue if authenticated or not accessing a protected route
  return NextResponse.next();
}

// Configure the middleware to match the /dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
