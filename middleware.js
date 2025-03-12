// middleware.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();

  // Get the current path
  const path = req.nextUrl.pathname;
  
  console.log("Middleware running for path:", path, "Session exists:", !!session);

  // Protected routes
  if (path.startsWith('/dashboard') && !session) {
    console.log("Redirecting to login from middleware");
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to dashboard if already logged in and trying to access login/register
  if ((path === '/login' || path === '/register') && session) {
    console.log("Redirecting to dashboard from middleware");
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
