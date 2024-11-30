'use client';

import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';

export interface AuthError {
  message: string;
  type?: string;
}

interface SignInOptions {
  email?: string;
  password?: string;
  provider?: string;
  callbackUrl?: string;
  redirect?: boolean;
}

interface SignOutOptions {
  callbackUrl?: string;
  redirect?: boolean;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useAuth(requireAdmin = false) {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  // Clear error when status changes
  useEffect(() => {
    if (error) setError(null);
  }, [status]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (requireAdmin && !session.user?.isAdmin) {
      router.push("/");
      return;
    }
  }, [session, status, router, requireAdmin]);

  const signIn = useCallback(async (options: SignInOptions) => {
    try {
      setIsLoading(true);
      setError(null);

      const { email, password, provider, callbackUrl = '/', redirect = true } = options;

      let result;
      if (provider) {
        // OAuth sign in
        result = await nextAuthSignIn(provider, {
          callbackUrl,
          redirect: false, // We'll handle redirect manually
        });
      } else {
        // Credentials sign in
        result = await nextAuthSignIn('credentials', {
          email,
          password,
          redirect: false,
        });
      }

      if (!result?.ok) {
        throw new Error(result?.error || 'Failed to sign in');
      }

      // Force session update
      await updateSession();

      if (redirect) {
        router.push(callbackUrl);
        router.refresh();
      }

      return result;
    } catch (e: any) {
      setError({
        message: e.message || 'An error occurred during sign in',
        type: 'SignInError',
      });
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [router, updateSession]);

  const signOut = useCallback(async (options: SignOutOptions = {}) => {
    let retries = 0;
    const { callbackUrl = '/', redirect = true } = options;

    const attemptSignOut = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        // Clear session from localStorage first
        if (typeof window !== 'undefined') {
          localStorage.removeItem('next-auth.session-token');
          localStorage.removeItem('next-auth.callback-url');
          localStorage.removeItem('next-auth.csrf-token');
        }

        // Attempt to sign out
        await nextAuthSignOut({
          callbackUrl,
          redirect: false,
        });

        // Force session update
        await updateSession();

        // Clear any remaining session data
        if (typeof window !== 'undefined') {
          sessionStorage.clear();
        }

        if (redirect) {
          // Use replace instead of push to prevent back navigation to authenticated pages
          router.replace(callbackUrl);
          router.refresh();
        }
      } catch (e: any) {
        console.error('Sign out error:', e);

        // If we haven't exceeded max retries, wait and try again
        if (retries < MAX_RETRIES) {
          retries++;
          await delay(RETRY_DELAY * retries);
          return attemptSignOut();
        }

        setError({
          message: e.message || 'An error occurred during sign out',
          type: 'SignOutError',
        });
        
        // If all retries failed, force a client-side redirect
        if (redirect) {
          window.location.href = callbackUrl;
        }
        
        throw e;
      } finally {
        setIsLoading(false);
      }
    };

    return attemptSignOut();
  }, [router, updateSession]);

  return {
    session,
    status,
    isLoading,
    error,
    signIn,
    signOut,
    isAuthenticated: status === 'authenticated',
    isAdmin: session?.user?.isAdmin || false,
  };
}
