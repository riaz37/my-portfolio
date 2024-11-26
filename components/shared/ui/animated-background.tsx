'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedBackground({ children, className = '' }: AnimatedBackgroundProps) {
  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Animated Grid Background */}
      <div className="fixed inset-0 bg-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-40">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full bg-secondary/20 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Noise Texture */}
        <div className="absolute inset-0 bg-noise opacity-20" />
      </div>

      {/* Gradient Overlays */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
