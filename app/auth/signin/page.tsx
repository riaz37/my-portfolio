'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Label } from '@/components/shared/ui/core/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/navigation/tabs';
import { AuthContainer } from '@/components/features/auth/AuthContainer';
import { GoogleButton } from '@/components/features/auth/GoogleButton';
import { OrDivider } from '@/components/features/auth/OrDivider';
import { PasswordInput } from '@/components/features/auth/PasswordInput';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/playground';

  // Handle error messages
  if (error) {
    toast.error('Authentication Error', {
      description: error === 'OAuthSignin' ? 'Error signing in with provider' :
                  error === 'OAuthCallback' ? 'Error during authentication' :
                  error === 'OAuthCreateAccount' ? 'Could not create user account' :
                  error === 'EmailCreateAccount' ? 'Could not create user account' :
                  error === 'Callback' ? 'Error during authentication' :
                  error === 'OAuthAccountNotLinked' ? 'Email already used with different provider' :
                  error === 'EmailSignin' ? 'Check your email for the sign in link' :
                  error === 'CredentialsSignin' ? 'Invalid email or password' :
                  error === 'Verification' ? 'Please verify your email before signing in' :
                  'An error occurred during sign in',
      duration: 5000,
    });
  }

  const handleCredentialsSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        if (result.error === 'Please verify your email before signing in') {
          toast.error('Email Not Verified', {
            description: 'Please check your email for the verification link.',
            duration: 5000,
          });
          router.push('/auth/verify-request');
          return;
        }

        toast.error('Sign in failed', {
          description: result.error === 'Invalid credentials' 
            ? 'Invalid email or password. Please try again.' 
            : result.error,
          duration: 5000,
        });
      } else if (result?.ok) {
        toast.success('Welcome back!', {
          description: 'Successfully signed in to your account.',
          duration: 3000,
        });
        router.push(callbackUrl);
      }
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again later.',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer 
      title="Sign in to Coding Playground"
      subtitle="Track your progress and improve your coding skills"
    >
      <div className="flex flex-col gap-4">
        <GoogleButton isLoading={isLoading} callbackUrl={callbackUrl} />
        <OrDivider />
      </div>

      <Tabs defaultValue="credentials" className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="credentials" className="w-full"></TabsTrigger>
        </TabsList>

        <TabsContent value="credentials">
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm"
                  onClick={() => router.push('/auth/forgot-password')}
                  disabled={isLoading}
                >
                  Forgot password?
                </Button>
              </div>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                required
                className="mt-1"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Button
          variant="link"
          className="font-medium hover:text-primary"
          onClick={() => router.push('/auth/signup')}
          disabled={isLoading}
        >
          Sign up
        </Button>
      </p>
    </AuthContainer>
  );
}
