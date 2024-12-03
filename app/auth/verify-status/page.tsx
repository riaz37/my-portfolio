'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/shared/ui/core/button';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  RefreshCcw, 
  AlertTriangle 
} from 'lucide-react';

export default function VerifyStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();
  const { toast } = useCustomToast();

  const [verificationStatus, setVerificationStatus] = useState<
    'loading' | 'success' | 'error' | 'pending'
  >('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get URL parameters
  const token = searchParams.get('token');
  const success = searchParams.get('success') === 'true';
  const error = searchParams.get('error');
  const message = searchParams.get('message');
  const email = searchParams.get('email');

  useEffect(() => {
    const verifyEmail = async () => {
      if (token) {
        try {
          // Make API call to verify email
          const response = await fetch(`/api/auth/verify-email?token=${token}`);
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to verify email');
          }

          // Force complete session refresh
          await update({ force: true });
          
          setVerificationStatus('success');
          toast({
            title: 'Success',
            description: data.message || 'Email verified successfully! Redirecting to playground...',
            variant: 'success',
          });

          // Redirect to signin after success message
          setTimeout(async () => {
            // Force another session refresh before redirect
            await update({ force: true });
            router.push('/playground');
          }, 2000);
        } catch (error) {
          setVerificationStatus('error');
          setErrorMessage(error instanceof Error ? error.message : 'Failed to verify email. Please try again.');
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to verify email. Please try again.',
            variant: 'error',
          });
        }
      } else if (success) {
        setVerificationStatus('success');
        toast({
          title: 'Success',
          description: message || 'Email verified successfully!',
          variant: 'success',
        });
        
        // Redirect to signin after success message
        setTimeout(() => {
          router.push(`/auth/signin?email=${encodeURIComponent(email || '')}&verified=true`);
        }, 2000);
      } else if (error) {
        setVerificationStatus('error');
        setErrorMessage(error);
      } else {
        setVerificationStatus('pending');
      }
    };

    verifyEmail();
  }, [token, success, error, router, toast, update]);

  const handleResendVerification = async () => {
    try {
      const emailToUse = email || session?.user?.email;
      
      if (!emailToUse) {
        toast({
          title: 'Error',
          description: 'No email address found. Please try signing in again.',
          variant: 'error',
        });
        return;
      }

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToUse }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Verification email sent! Please check your inbox.',
          variant: 'success',
        });
      } else {
        throw new Error(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to resend verification email',
        variant: 'error',
      });
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
            <h2 className="mt-4 text-xl font-semibold">Verifying Your Email</h2>
            <p className="mt-2 text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case 'success':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-green-600">
              Email Verified Successfully!
            </h2>
            <p className="mt-2 text-muted-foreground">
              {message || 'Your email has been verified. Redirecting to playground...'}
            </p>
          </motion.div>
        );

      case 'error':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-4 text-2xl font-bold text-red-600">
              Verification Failed
            </h2>
            <p className="mt-2 text-muted-foreground">
              {errorMessage || 'Unable to verify your email. Please try again.'}
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleResendVerification}
              >
                <RefreshCcw className="mr-2 h-4 w-4" /> Resend Verification
              </Button>
              <Button 
                onClick={() => router.push('/auth/signin')}
              >
                Back to Sign In
              </Button>
            </div>
          </motion.div>
        );

      case 'pending':
        return (
          <div className="text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
            <h2 className="mt-4 text-xl font-semibold text-yellow-600">
              Verification Pending
            </h2>
            <p className="mt-2 text-muted-foreground">
              Please check your email and click the verification link.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleResendVerification}
              >
                <RefreshCcw className="mr-2 h-4 w-4" /> Resend Verification
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-lg p-8 border border-border">
        {renderContent()}
      </div>
    </div>
  );
}
