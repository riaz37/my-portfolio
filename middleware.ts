import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define route configurations with roles and permissions
const routeConfig = {
  public: [
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/auth/verify-request',
    '/',
    '/about',
    '/contact',
    '/playground',
    '/playground/challenges-list',
    '/playground/learning-paths',
    '/api/auth/signout'
  ],
  protected: {
    user: [
      '/playground/leaderboard',
      '/playground/practice',
      '/playground/community',
      '/playground/hints',
      '/settings'
    ],
    admin: [
      '/admin',
      '/admin/dashboard',
      '/admin/users',
      '/admin/content',
      '/admin/blogs',
      '/admin/settings'
    ]
  }
} as const;

// Helper function to check if a path matches any pattern
function matchesPath(path: string, patterns: readonly string[]): boolean {
  return patterns.some(p => path === p || path.startsWith(`${p}/`));
}

// Helper function to check if a path is excluded from middleware
function isExcludedPath(path: string): boolean {
  return (
    path.startsWith('/_next') || 
    path.startsWith('/images/') ||
    path.startsWith('/fonts/') ||
    path.startsWith('/favicon.ico') ||
    (path.startsWith('/api/') && !path.startsWith('/api/auth/'))
  );
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip middleware for excluded paths
  if (isExcludedPath(path)) {
    return NextResponse.next();
  }

  // Allow public paths
  if (matchesPath(path, routeConfig.public)) {
    return NextResponse.next();
  }

  // Check for protected paths
  const needsAuth = matchesPath(path, [...routeConfig.protected.user, ...routeConfig.protected.admin]);
  const needsAdmin = matchesPath(path, routeConfig.protected.admin);

  if (needsAuth || needsAdmin) {
    try {
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
      });

      if (!token) {
        const signInUrl = new URL('/auth/signin', request.url);
        signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
      }

      // Check admin access
      if (needsAdmin && !token.isAdmin) {
        return NextResponse.redirect(
          new URL('/', request.url)
        );
      }

      // Add user info to headers for downstream use
      const response = NextResponse.next();
      response.headers.set('x-user-id', token.sub || '');
      response.headers.set('x-user-admin', token.isAdmin ? 'true' : 'false');
      return response;

    } catch (error) {
      console.error('Middleware auth error:', error);
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('error', 'AuthError');
      return NextResponse.redirect(signInUrl);
    }
  }

  // Allow access to all other routes
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
