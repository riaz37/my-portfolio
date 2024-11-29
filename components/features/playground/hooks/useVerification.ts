'use client';

import { useState } from 'react';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { Session } from 'next-auth';

export function useVerification(session: Session | null) {
  const [isResending, setIsResending] = useState(false);
  const { toast } = useCustomToast();

  const handleResendVerification = async () => {
    if (!session?.user?.email || isResending) return;

    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend verification email');
      }

      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox for the verification link.',
        className: 'text-black'
      });
    } catch (error) {
      console.error('Error resending verification:', error);
      toast({
        title: 'Error',
        description: 'Failed to resend verification email. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  return {
    isResending,
    handleResendVerification,
  };
}
