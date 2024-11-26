'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface BackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

// Function to generate random values within a range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Function to generate random coordinates
const randomPosition = () => ({
  x: random(-100, 100),
  y: random(-100, 100),
  scale: random(0.8, 1.2),
});

export function DynamicBackground({ children, className }: BackgroundProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientControls = useAnimation();
  const [orbPositions, setOrbPositions] = useState<{ [key: string]: any }>({});
  const [currentGradientIndex, setCurrentGradientIndex] = useState(0);

  // Array of different gradient patterns
  const gradientPatterns = [
    [
      'radial-gradient(circle at 0% 0%, rgba(var(--primary-rgb), 0.15) 0%, transparent 50%)',
      'radial-gradient(circle at 100% 100%, rgba(var(--secondary-rgb), 0.15) 0%, transparent 50%)',
      'radial-gradient(circle at 50% 50%, rgba(var(--accent-rgb), 0.15) 0%, transparent 50%)',
    ],
    [
      'radial-gradient(circle at 30% 30%, rgba(var(--primary-rgb), 0.2) 0%, transparent 40%)',
      'radial-gradient(circle at 70% 70%, rgba(var(--secondary-rgb), 0.2) 0%, transparent 40%)',
    ],
    [
      'radial-gradient(ellipse at top, rgba(var(--primary-rgb), 0.15) 0%, transparent 50%)',
      'radial-gradient(ellipse at bottom, rgba(var(--secondary-rgb), 0.15) 0%, transparent 50%)',
      'radial-gradient(circle at center, rgba(var(--accent-rgb), 0.1) 0%, transparent 40%)',
    ],
  ];

  // Animate gradient
  useEffect(() => {
    const animateBackground = async () => {
      // Cycle through gradient patterns
      const interval = setInterval(() => {
        setCurrentGradientIndex((prev) => (prev + 1) % gradientPatterns.length);
      }, 15000); // Change pattern every 15 seconds

      return () => clearInterval(interval);
    };

    animateBackground();
  }, []);

  // Animate gradient based on current pattern
  useEffect(() => {
    gradientControls.start({
      background: gradientPatterns[currentGradientIndex],
      transition: {
        duration: 10,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    });
  }, [currentGradientIndex, gradientControls]);

  // Update orb positions periodically
  useEffect(() => {
    const updateOrbPositions = () => {
      setOrbPositions({
        primary: randomPosition(),
        secondary: randomPosition(),
        accent: randomPosition(),
      });
    };

    updateOrbPositions();
    const interval = setInterval(updateOrbPositions, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full">
      <div className="fixed inset-0 -z-10">
        <motion.div
          ref={containerRef}
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-br from-background to-background/80',
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Enhanced noise texture */}
          <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay [background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)]" />

          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-40"
            animate={gradientControls}
          />

          {/* Dynamic gradient orbs */}
          <AnimatePresence mode="wait">
            <div className="absolute inset-0 overflow-hidden">
              {/* Primary orb */}
              <motion.div
                key={`primary-${JSON.stringify(orbPositions.primary)}`}
                className="absolute h-[800px] w-[800px] rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl"
                initial={{ x: 0, y: 0, scale: 1, opacity: 0 }}
                animate={{
                  x: orbPositions.primary?.x || 0,
                  y: orbPositions.primary?.y || 0,
                  scale: orbPositions.primary?.scale || 1,
                  opacity: 0.6,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 8,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />

              {/* Secondary orb */}
              <motion.div
                key={`secondary-${JSON.stringify(orbPositions.secondary)}`}
                className="absolute right-0 bottom-0 h-[700px] w-[700px] rounded-full bg-gradient-to-l from-secondary/20 to-accent/20 blur-3xl"
                initial={{ x: 0, y: 0, scale: 1, opacity: 0 }}
                animate={{
                  x: orbPositions.secondary?.x || 0,
                  y: orbPositions.secondary?.y || 0,
                  scale: orbPositions.secondary?.scale || 1,
                  opacity: 0.5,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 10,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />

              {/* Accent orb */}
              <motion.div
                key={`accent-${JSON.stringify(orbPositions.accent)}`}
                className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-accent/10 via-primary/10 to-secondary/10 blur-3xl"
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                  x: orbPositions.accent?.x || 0,
                  y: orbPositions.accent?.y || 0,
                  scale: orbPositions.accent?.scale || 1,
                  opacity: 0.4,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 12,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            </div>
          </AnimatePresence>

          {/* Animated grid overlay */}
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0.01 }}
            animate={{ 
              opacity: [0.01, 0.02, 0.01],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </motion.div>
      </div>

      {children}
    </div>
  );
}
