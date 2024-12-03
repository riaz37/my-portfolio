'use client';

import { type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Loading } from '@/components/shared/loading';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

// Define restricted paths that require authentication
const restrictedPaths = [
  '/playground/leaderboard',
  '/playground/community-hub',
  '/playground/profile',
  '/playground/settings',
  '/playground/challenges/create',
  '/playground/challenges/edit',
];

// Define paths that are accessible without authentication but show limited features
const limitedAccessPaths = [
  '/playground/practice-arena',
  '/playground/learning-paths',
  '/playground/challenges',
  '/playground/resources',
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

  // Check if current path has limited access
  const isLimitedAccessPath = limitedAccessPaths.some(path => 
    pathname?.startsWith(path)
  );

  // Check if it's the root playground page
  const isRootPlayground = pathname === '/playground';

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading text="Loading playground..." />
      </div>
    );
  }

  // Redirect to sign in if not authenticated and trying to access restricted path
  if (status === 'unauthenticated' && isRestrictedPath) {
    redirect('/auth/signin?callbackUrl=/playground');
  }

  // Allow access to root playground page and non-restricted paths
  if (isRootPlayground || (!isRestrictedPath && !isLimitedAccessPath)) {
    return (
      <Suspense 
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <Loading text="Loading playground..." />
          </div>
        }
      >
        <div className="min-h-screen flex flex-col bg-background">
          {children}
        </div>
      </Suspense>
    );
  }

  // Handle limited access paths
  if (isLimitedAccessPath) {
    return (
      <Suspense 
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <Loading text="Loading playground..." />
          </div>
        }
      >
        <div className="min-h-screen flex flex-col bg-background">
          {!session && (
            <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-primary/10">
              <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-sm text-center sm:text-left text-muted-foreground">
                    Sign in to unlock all features, track your progress, and join our community!
                  </p>
                  <a
                    href={`/auth/signin?callbackUrl=${encodeURIComponent(pathname || '/playground')}`}
                    className={cn(
                      "group inline-flex items-center gap-2 text-sm font-medium",
                      "px-4 py-2 rounded-md",
                      "bg-primary text-primary-foreground",
                      "hover:bg-primary/90 transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    )}
                  >
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </Suspense>
    );
  }

  // For restricted paths, show authentication required message
  if (!session && isRestrictedPath) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Authentication Required</h2>
              <p className="text-muted-foreground">
                Please sign in to access this feature. Create an account to unlock all playground features and track your progress.
              </p>
              <a
                href={`/auth/signin?callbackUrl=${encodeURIComponent(pathname || '/playground')}`}
                className={cn(
                  "inline-flex items-center gap-2 text-sm font-medium",
                  "px-6 py-2.5 rounded-md",
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
              >
                Sign In to Continue
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default case: render children with authentication
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loading text="Loading playground..." />
        </div>
      }
    >
      <div className="min-h-screen flex flex-col bg-background">
        {children}
      </div>
    </Suspense>
  );
}
