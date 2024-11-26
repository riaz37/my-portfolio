'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function VerifyingEmail() {
  return (
    <>
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
                <Mail className="w-16 h-16 mx-auto text-primary animate-bounce" />
              </motion.div>

              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-2xl font-semibold"
              >
                Verifying Your Email
              </motion.h1>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-muted-foreground"
              >
                Please wait while we verify your email address...
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </motion.div>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-sm text-muted-foreground"
              >
                This may take a few moments
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
