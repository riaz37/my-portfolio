import { useState } from 'react';
import { Session } from 'next-auth';
import { useToast } from './use-toast';

export function useVerification(session: Session | null) {
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleResendVerification = async () => {
    if (!session?.user?.email) return;

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
        title: 'Verification Email Sent',
        description: 'Please check your inbox for the verification link.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send verification email. Please try again later.',
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
