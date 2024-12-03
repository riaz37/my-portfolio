'use client';

import { useState } from 'react';
import { AlertCircle, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/shared/ui/core/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/shared/ui/feedback/alert';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { motion } from 'framer-motion';

interface VerificationBannerProps {
  email: string;
  onResendVerification: () => Promise<void>;
}

export function VerificationBanner({ email, onResendVerification }: VerificationBannerProps) {
  const [isResending, setIsResending] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);
  const { toast } = useCustomToast();

  const handleResend = async () => {
    if (isResending) return;
    
    setIsResending(true);
    try {
      await onResendVerification();
      setLastSentTime(new Date());
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your inbox for the verification link.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend verification email. Please try again.',
        variant: 'error',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Alert variant="warning" className="relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-warning/20 rounded-full">
            <Mail className="h-6 w-6 text-warning-foreground" />
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <AlertTitle className="text-lg font-semibold mb-1">
                Verify Your Email Address
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">
                A verification link has been sent to <span className="font-medium text-foreground">{email}</span>.
                Please check your inbox and click the link to verify your account.
              </AlertDescription>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResend}
                disabled={isResending}
                className="relative"
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>
              
              {lastSentTime && (
                <p className="text-sm text-muted-foreground flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-success" />
                  Last sent at {lastSentTime.toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="mt-2 text-sm text-muted-foreground">
              <p>
                Can&apos;t find the email? Check your spam folder or try resending the verification email.
                If you continue to have issues, please contact support.
              </p>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 opacity-[0.02]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mail-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M-3,3 l6,-6 M0,10 l10,-10 M7,13 l6,-6" strokeWidth="1" stroke="currentColor" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mail-pattern)" />
          </svg>
        </div>
      </Alert>
    </motion.div>
  );
}
