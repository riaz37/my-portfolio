'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingProps {
  text?: string;
  className?: string;
}

export function Loading({ text = 'Loading...', className }: LoadingProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          'flex flex-col items-center gap-4',
          className
        )}
      >
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.1, 1],
            opacity: 1
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="relative w-16 h-16"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <div className="absolute inset-0 bg-primary/40 rounded-full animate-pulse" />
          <div className="absolute inset-0 border-2 border-primary rounded-full animate-spin" />
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground font-medium"
        >
          {text}
        </motion.p>
      </motion.div>
    </div>
  );
}
