'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { DynamicBackground } from '@/components/ui/dynamic-background';

export default function VerifyEmailPage() {
  const [message, setMessage] = useState('Verifying your email...');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/auth/verify-error?error=Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        return data;
      } catch (error) {
        console.error('Verification error:', error);
        throw error;
      }
    };

    verifyEmail()
      .then((data) => {
        if (data.code === 'already_verified') {
          router.push(`/auth/verify-success?message=${encodeURIComponent(data.message)}&redirect=${encodeURIComponent(data.redirect)}`);
        } else {
          router.push(`/auth/verify-success?redirect=${encodeURIComponent(data.redirect || '/playground')}`);
        }
      })
      .catch((error) => {
        router.push(`/auth/verify-error?error=${encodeURIComponent(error.message)}`);
      });
  }, [token, router]);

  return (
    <>
      <DynamicBackground />
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative w-full max-w-md mx-auto p-6">
          <div className="bg-background/80 backdrop-blur-lg rounded-lg shadow-lg p-8 border border-border">
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <h2 className="mt-4 text-xl font-semibold">{message}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
