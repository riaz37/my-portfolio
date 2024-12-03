'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/shared/ui/core/button';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { Loader2 } from 'lucide-react';

interface GoogleButtonProps {
  isLoading: boolean;
  callbackUrl?: string;
  className?: string;
  onClick?: () => void | Promise<void>;
}

export function GoogleButton({ isLoading: parentLoading, callbackUrl = '/playground', className, onClick }: GoogleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useCustomToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signIn('google', {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        console.error('Google Sign In Error:', result.error);
        toast({
          variant: "error",
          title: "Google Sign In Failed",
          description: result.error === 'OAuthAccountNotLinked'
            ? 'An account with this email already exists. Please sign in with your existing provider.'
            : result.error === 'Configuration'
            ? 'There is an issue with the Google sign-in configuration. Please try again later.'
            : result.error === 'AccessDenied'
            ? 'Access was denied during sign in. Please try again.'
            : result.error === 'Callback'
            ? 'Authentication error occurred. Please try again.'
            : 'Failed to sign in with Google. Please try again.',
        });
      } else if (result?.url) {
        // Explicitly handle successful sign-in
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Unexpected Google Sign In Error:', error);
      toast({
        variant: "error",
        title: "Authentication Error",
        description: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick || handleGoogleSignIn}
      className={`w-full bg-white text-black hover:bg-gray-50 border border-gray-300 ${className}`}
      disabled={isLoading || parentLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      {isLoading ? 'Signing in...' : 'Continue with Google'}
    </Button>
  );
}
