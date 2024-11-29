'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Label } from '@/components/shared/ui/core/label';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { AuthContainer } from '@/components/features/auth/AuthContainer';
import { GoogleButton } from '@/components/features/auth/GoogleButton';
import { OrDivider } from '@/components/features/auth/OrDivider';
import { PasswordInput } from '@/components/features/auth/PasswordInput';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useCustomToast();
  const { update: updateSession } = useSession();
  const callbackUrl = searchParams?.get('callbackUrl') || '/playground';

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;
      const username = formData.get('username') as string;

      if (password !== confirmPassword) {
        toast({
          variant: "error",
          title: "Error",
          description: "Passwords do not match"
        });
        return;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Sign in the user after successful registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Failed to sign in after registration');
      }

      // Update session before showing toast and redirecting
      await updateSession();

      // Show verification email toast
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox and click the verification link.",
      });

      // Use router.replace instead of push to ensure clean navigation
      router.replace(callbackUrl);
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        variant: "error",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create account'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Create your account"
      subtitle="Join the Coding Playground community"
    >
      <div className="flex flex-col gap-4">
        <GoogleButton isLoading={isLoading} callbackUrl={callbackUrl} />
        <OrDivider text="Or continue with email" />
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            required
            minLength={8}
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <span 
          onClick={() => router.push('/auth/signin')} 
          className="font-medium text-primary hover:underline cursor-pointer"
        >
          Sign in
        </span>
      </p>
    </AuthContainer>
  );
}
