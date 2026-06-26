import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Paths that require authentication
const protectedPaths = ['/', '/dashboard'];
// Paths that should redirect to dashboard if already authenticated
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Verify token
  let isAuthenticated = false;
  if (token) {
    const payload = verifyToken(token);
    isAuthenticated = !!payload;
  }

  // Protect main app routes
  if (protectedPaths.some(path => pathname === path || pathname.startsWith('/dashboard'))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect to dashboard if already logged in and trying to access auth pages
  if (authPaths.some(path => pathname === path)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*'],
};