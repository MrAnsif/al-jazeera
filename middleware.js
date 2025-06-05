import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const auth = isAuthenticated(request);
    
    if (!auth.authenticated) {
      // For API routes, return JSON error
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ 
          success: false, 
          message: 'Unauthorized access' 
        }, { status: 401 });
      }
      
      // For admin pages, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Add user info to headers for use in API routes
    const response = NextResponse.next();
    response.headers.set('x-admin-email', auth.user.email);
    response.headers.set('x-admin-role', auth.user.role);
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};