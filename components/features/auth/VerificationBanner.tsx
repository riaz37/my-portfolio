'use client';

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/shared/ui/feedback/alert';
import { Button } from '@/components/shared/ui/core/button';
import { Mail, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VerificationBannerProps {
  email: string;
}

export function VerificationBanner({ email }: VerificationBannerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend verification email');
      }

      toast.success('Verification email sent!', {
        description: 'Please check your inbox and spam folder.',
        className: 'text-black'
      });
    } catch (error) {
      console.error('Error resending verification:', error);
      toast.error('Failed to send verification email', {
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <Alert className="relative flex items-center gap-4 bg-yellow-50 text-yellow-900 border-yellow-200">
      <Mail className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex-1">
        Please verify your email address to access all features.
      </AlertDescription>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResendVerification}
          disabled={isLoading}
          className="h-7 px-2 text-xs border-yellow-300 hover:bg-yellow-100 hover:text-yellow-900"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Sending...
            </>
          ) : (
            'Resend Email'
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDismissed(true)}
          className="h-7 w-7 p-0 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-900"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
