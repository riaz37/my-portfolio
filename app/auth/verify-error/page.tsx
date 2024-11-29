'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';


export default function VerificationError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams ? searchParams.get('error') || 'An error occurred during verification' : 'An error occurred during verification';
  const {toast} = useCustomToast();

  useEffect(() => {
    toast({
      variant: "error",
      title: "Verification Failed",
      description: error,
    });

    // Redirect to sign in after delay
    const timer = setTimeout(() => {
      router.push('/auth/signin');
    }, 5000);

    return () => clearTimeout(timer);
  }, [error, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="relative w-full max-w-md mx-auto p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-background/80 backdrop-blur-lg rounded-lg shadow-lg p-8 border border-border"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1 
              }}
              className="mx-auto"
            >
              <XCircle className="w-16 h-16 mx-auto text-destructive" />
            </motion.div>
            
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-3xl font-bold tracking-tight text-foreground"
            >
              Verification Failed
            </motion.h2>
            
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-muted-foreground"
            >
              {error}
            </motion.p>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-sm text-muted-foreground"
            >
              Redirecting to sign in page in 5 seconds...
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
