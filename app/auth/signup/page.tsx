'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Label } from '@/components/shared/ui/core/label';
import { toast } from 'sonner';
import { AuthContainer } from '@/components/features/auth/AuthContainer';
import { GoogleButton } from '@/components/features/auth/GoogleButton';
import { OrDivider } from '@/components/features/auth/OrDivider';
import { PasswordInput } from '@/components/features/auth/PasswordInput';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/playground';

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;
      const username = formData.get('username') as string;

      // Log form data (excluding passwords)
      console.log('Form data:', { email, username });

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      console.log('Sending registration request...');
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
      console.log('Registration response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Sign in the user after successful registration
      console.log('Registration successful, attempting sign in...');
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        console.error('Sign in error:', result.error);
        throw new Error('Failed to sign in after registration');
      }

      // Show verification email toast
      toast.success('Verification Email Sent', {
        description: 'Please check your inbox and click the verification link.',
        duration: 6000,
        icon: '✉️',
        style: {
          backgroundColor: 'var(--primary)',
          color: 'black',
        },
        className: 'font-medium',
      });

      router.push(callbackUrl);
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
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
        <Button
          variant="link"
          className="font-medium hover:text-primary"
          onClick={() => router.push('/auth/signin')}
        >
          Sign in
        </Button>
      </p>
    </AuthContainer>
  );
}
