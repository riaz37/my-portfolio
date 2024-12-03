import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Public paths that don't require authentication
const publicPaths = [
  '/auth/signin',
  '/auth/signup',
  '/auth/verify-status',
  '/api/auth',
  '/api/verify/email',
  '/api/auth/verify-email',
  '/api/auth/register',
  '/',
  '/about',
  '/contact',
  '/_next',
  '/images',
  '/fonts',
  '/favicon.ico',
];

// Paths that require email verification
const verificationRequiredPaths = ['/playground', '/dashboard', '/profile'];

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
    '/api/auth/signout',
    '/playground'  // Allow public access to playground root
  ],
  protected: {
    user: [
      '/playground/leaderboard',
      '/playground/practice',
      '/playground/community',
      '/playground/hints',
      '/playground/challenges-list',
      '/playground/learning-paths',
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
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths and static files
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });

  // If not authenticated, redirect to signin
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Handle email verification
  if (verificationRequiredPaths.some((path) => pathname.startsWith(path))) {
    if (!token.emailVerified) {
      // Redirect to verify-email page with email parameter
      const verifyEmailUrl = new URL('/auth/verify-email', request.url);
      if (token.email) {
        verifyEmailUrl.searchParams.set('email', token.email);
      }
      return NextResponse.redirect(verifyEmailUrl);
    }
  }

  // If on verify-email page and already verified, redirect to playground
  if (pathname.startsWith('/auth/verify-email') && token.emailVerified) {
    return NextResponse.redirect(new URL('/playground', request.url));
  }

  // If on signin/signup and already authenticated, redirect to playground
  if (
    (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup')) &&
    token
  ) {
    return NextResponse.redirect(new URL('/playground', request.url));
  }

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
