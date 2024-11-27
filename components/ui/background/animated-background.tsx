'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax effect for background elements
  const y1 = useTransform(scrollY, [0, 1000], ['0%', '50%']);
  const y2 = useTransform(scrollY, [0, 1000], ['0%', '30%']);
  const y3 = useTransform(scrollY, [0, 1000], ['0%', '20%']);

  // Smooth mouse movement
  const smoothMouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
        smoothMouseX.set(x * 100);
        smoothMouseY.set(y * 100);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [smoothMouseX, smoothMouseY]);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-background bg-[radial-gradient(circle_at_50%_120%,#312E81_0%,#1E1B4B_25%,#030711_50%)]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#20203508_1px,transparent_1px),linear-gradient(to_bottom,#20203508_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Animated gradient orbs */}
      <motion.div
        style={{ y: y1 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -left-1/4 top-1/4 h-[30rem] w-[30rem] rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-[128px]"
      />

      <motion.div
        style={{ y: y2 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute -right-1/4 top-1/2 h-[25rem] w-[25rem] rounded-full bg-gradient-to-l from-secondary/30 to-primary/30 blur-[128px]"
      />

      {/* Interactive glow effect */}
      <motion.div
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
        }}
        className="pointer-events-none absolute left-0 top-0 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-accent/20 to-transparent blur-[64px] opacity-50"
      />

      {/* Animated lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -100 }}
            animate={{
              opacity: [0, 0.5, 0],
              x: ['0%', '100%'],
              y: [`${20 + i * 25}%`, `${20 + i * 25}%`],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2,
              ease: 'linear',
            }}
            className="absolute h-px w-48 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          />
        ))}
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.02]" />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.5)_160%)]" />
    </div>
  );
}
