'use client';

import { motion } from 'framer-motion';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeMap = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const textSizeMap = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Loading({ size = 'md', text, className = '' }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative">
        {/* Outer spinning circle */}
        <motion.div
          className={`${sizeMap[size]} rounded-full border-2 border-primary/20`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner spinning circle */}
        <motion.div
          className={`absolute inset-0 ${sizeMap[size]} rounded-full border-2 border-t-primary border-r-primary border-b-transparent border-l-transparent`}
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        {/* Pulsing dot */}
        <motion.div
          className={`absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      {text && (
        <motion.p
          className={`${textSizeMap[size]} text-muted-foreground`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <Loading size="lg" text="Loading..." />
    </div>
  );
}

export function LoadingInline() {
  return <Loading size="sm" />;
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loading size="lg" text="Loading..." />
    </div>
  );
}
