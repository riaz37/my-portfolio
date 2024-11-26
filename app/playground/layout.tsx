'use client';

import { type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Loading } from '@/components/shared/loading';

// Define restricted paths that require authentication
const restrictedPaths = [
  '/playground/leaderboard',
  '/playground/practice',
  '/playground/community',
  '/playground/hints',
];

interface PlaygroundLayoutProps {
  children: ReactNode;
}

export default function PlaygroundLayout({
  children,
}: PlaygroundLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Check if current path requires authentication
  const isRestrictedPath = restrictedPaths.some(path => 
    pathname?.startsWith(path)
  );

  // Redirect to sign in if not authenticated
  if (status === 'unauthenticated' && isRestrictedPath) {
    redirect('/auth/signin?callbackUrl=/playground');
  }

  // Show loading state while checking session
  if (status === 'loading') {
    return <Loading text="Loading playground..." />;
  }

  // Allow access to non-restricted paths for all users
  if (!isRestrictedPath) {
    return (
      <Suspense fallback={<Loading text="Loading playground..." />}>
        {children}
      </Suspense>
    );
  }

  // For restricted paths, check authentication and verification
  if (!session && isRestrictedPath) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="text-muted-foreground text-center mb-6">
          Please sign in to access this feature.
        </p>
        <a
          href={`/auth/signin?callbackUrl=${encodeURIComponent(pathname || '/playground')}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Sign In
        </a>
      </div>
    );
  }

  // Check email verification for restricted paths
  if (session && !session.user.isVerified && isRestrictedPath) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h2 className="text-2xl font-bold mb-4">Email Verification Required</h2>
        <p className="text-muted-foreground text-center mb-6">
          Please verify your email to access this feature.
        </p>
        <a
          href="/auth/verify-request"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Verify Email
        </a>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading text="Loading playground..." />}>
      {children}
    </Suspense>
  );
}
