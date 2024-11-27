'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/shared/ui/feedback/use-toast';

export default function VerificationSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const message = searchParams.get('message') || 'Email verified successfully!';
  const redirect = searchParams.get('redirect') || '/playground';

  useEffect(() => {
    toast({
      title: "Success",
      description: message,
    });
    
    // Redirect after delay
    const timer = setTimeout(() => {
      router.replace(redirect);
    }, 2000);

    return () => clearTimeout(timer);
  }, [message, redirect, router]);

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
              className="flex justify-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-2xl font-bold text-foreground"
            >
              Success!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-muted-foreground"
            >
              {message}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-1 text-sm text-muted-foreground"
            >
              Redirecting you to the playground...
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
