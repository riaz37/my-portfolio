'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/shared/ui/core/button';
import { useRouter } from 'next/navigation';
import { AuthContainer } from '@/components/features/auth/AuthContainer';
import { AlertCircle } from 'lucide-react';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Already Exists',
          message: 'An account with this email already exists. Please sign in with your existing account (email/password) first, then you can link your Google account.',
          action: 'Sign In'
        };
      case 'OAuthSignin':
      case 'OAuthCallback':
        return {
          title: 'Sign In Error',
          message: 'There was a problem signing in with Google. Please try again or use a different sign-in method.',
          action: 'Try Again'
        };
      case 'EmailSignin':
        return {
          title: 'Email Sign In Failed',
          message: 'The email sign-in link is invalid or has expired. Please try again.',
          action: 'Try Again'
        };
      case 'CredentialsSignin':
        return {
          title: 'Invalid Credentials',
          message: 'The email or password you entered is incorrect. Please try again.',
          action: 'Try Again'
        };
      default:
        return {
          title: 'Authentication Error',
          message: 'An error occurred during authentication. Please try again.',
          action: 'Try Again'
        };
    }
  };

  const errorDetails = getErrorMessage(error);

  const handleAction = () => {
    router.push('/auth/signin');
  };

  return (
    <AuthContainer
      title={errorDetails.title}
      subtitle={errorDetails.message}
    >
      <div className="flex flex-col items-center space-y-6">
        <AlertCircle className="h-12 w-12 text-destructive" />
        
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-destructive">{errorDetails.title}</h2>
          <p className="text-sm text-muted-foreground">{errorDetails.message}</p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <Button onClick={handleAction} className="w-full">
            {errorDetails.action}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </AuthContainer>
  );
}
