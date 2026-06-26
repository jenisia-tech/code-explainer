import { NextRequest, NextResponse } from 'next/server';

// Paths that require authentication
const protectedPaths = ['/', '/dashboard'];
// Paths that should redirect to dashboard if already authenticated
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Lightweight check: only verify cookie existence.
  // Full JWT verification happens in API route handlers (Node.js runtime),
  // since jsonwebtoken is not compatible with the Edge Runtime.
  const hasToken = !!token;

  // Protect main app routes
  if (protectedPaths.some(path => pathname === path || pathname.startsWith('/dashboard'))) {
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect to dashboard if already logged in and trying to access auth pages
  if (authPaths.some(path => pathname === path)) {
    if (hasToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*'],
};