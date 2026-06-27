import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = ['/', '/dashboard'];
const authPaths = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;
  const hasToken = !!token;

  if (protectedPaths.some((path) => pathname === path || pathname.startsWith('/dashboard'))) {
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (authPaths.some((path) => pathname === path)) {
    if (hasToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*'],
};
