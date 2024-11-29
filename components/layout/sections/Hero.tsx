// components/sections/Hero.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/shared/ui/core/button';
import { ArrowRight, Mail, Rocket, Terminal as TerminalIcon, ArrowDown, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { MouseScroll } from '@/components/shared/ui/mouse-scroll';
import Terminal from '@/components/features/Terminal';

const roles = [
  'Full Stack Developer',
  'Problem Solver',
  'Tech Enthusiast',
];

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: delay,
      ease: "easeOut"
    }
  })
};

export default function Hero() {
  const [currentRole, setCurrentRole] = useState(roles[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % roles.length;
        setCurrentRole(roles[nextIndex]);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 relative flex flex-col justify-center items-center min-h-[calc(100vh-5rem)]">
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 sm:gap-12 max-w-4xl mx-auto w-full">
        <motion.div
          variants={fadeInUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="space-y-4 sm:space-y-8 text-center"
        >
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1, bounce: 0.4 }}
              className="relative"
            >
              {/* Orbital Glow Effect */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: {
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  scale: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `
                    radial-gradient(circle at 50% 0%, ${`rgba(var(--primary-rgb), 0.3)`} 0%, transparent 50%),
                    radial-gradient(circle at 85.4% 14.6%, ${`rgba(var(--primary-rgb), 0.25)`} 0%, transparent 50%),
                    radial-gradient(circle at 100% 50%, ${`rgba(var(--secondary-rgb), 0.2)`} 0%, transparent 50%),
                    radial-gradient(circle at 85.4% 85.4%, ${`rgba(var(--primary-rgb), 0.25)`} 0%, transparent 50%),
                    radial-gradient(circle at 50% 100%, ${`rgba(var(--secondary-rgb), 0.3)`} 0%, transparent 50%),
                    radial-gradient(circle at 14.6% 85.4%, ${`rgba(var(--primary-rgb), 0.25)`} 0%, transparent 50%),
                    radial-gradient(circle at 0% 50%, ${`rgba(var(--secondary-rgb), 0.2)`} 0%, transparent 50%),
                    radial-gradient(circle at 14.6% 14.6%, ${`rgba(var(--primary-rgb), 0.25)`} 0%, transparent 50%)
                  `
                }}
              />

              {/* Pulsing Glow */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1.2, 1.3, 1.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 blur-2xl"
              />

              {/* Rotating Sparkle Effect */}
              <motion.div
                animate={{
                  rotate: [0, -360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: {
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `
                    radial-gradient(2px 2px at 40% 40%, ${`rgba(var(--primary-rgb), 0.4)`} 50%, transparent),
                    radial-gradient(2px 2px at 60% 20%, ${`rgba(var(--secondary-rgb), 0.3)`} 50%, transparent),
                    radial-gradient(2px 2px at 20% 60%, ${`rgba(var(--primary-rgb), 0.4)`} 50%, transparent),
                    radial-gradient(2px 2px at 80% 80%, ${`rgba(var(--secondary-rgb), 0.3)`} 50%, transparent)
                  `
                }}
              />

              {/* Main Image Container */}
              <motion.div 
                className="relative rounded-full bg-gradient-to-b from-primary/20 to-secondary/20 p-[2px] backdrop-blur-[2px]"
                whileHover={{
                  scale: 1.05,
                  rotate: [0, -5, 5, 0],
                  transition: {
                    scale: { duration: 0.2 },
                    rotate: { duration: 0.5, repeat: Infinity }
                  }
                }}
              >
                <motion.div 
                  className="rounded-full p-2 backdrop-blur-sm bg-background/80"
                  whileHover={{
                    boxShadow: [
                      "0 0 10px rgba(var(--primary-rgb), 0.3)",
                      "0 0 20px rgba(var(--primary-rgb), 0.5)",
                      "0 0 10px rgba(var(--primary-rgb), 0.3)",
                    ],
                    transition: {
                      duration: 1,
                      repeat: Infinity,
                    }
                  }}
                >
                  <Image
                    priority
                    src="/profile.svg"
                    alt="Riaz's Profile"
                    width={160}
                    height={160}
                    className="rounded-full bg-muted p-2 sm:p-3 md:p-6 object-cover relative sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px]"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          <div className="space-y-2 sm:space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium tracking-wider uppercase"
            >
              Welcome to my world
            </motion.h2>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              Hi, I'm{" "}
              <span className="inline-block relative">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    times: [0, 0.2, 0.5, 0.8, 1],
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="inline-block bg-gradient-to-r from-violet-500 via-primary to-violet-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x"
                >
                  Riaz
                </motion.span>
              </span>
            </motion.h1>

            <div className="h-[40px] sm:h-[48px] flex justify-center items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentRole}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl sm:text-2xl text-muted-foreground"
                >
                  {currentRole}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.p
          variants={fadeInUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
          className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-center max-w-2xl"
        >
          Turning coffee into code and passion into knowledge. Let's build something amazing together.
        </motion.p>

        <motion.div
          variants={fadeInUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/portfolio">
            <Button
              size="lg"
              variant="outline"
              className="group relative overflow-hidden hover:border-primary/50 transition-all duration-300 min-w-[160px]"
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative flex items-center gap-2"
              >
                <LayoutGrid className="h-4 w-4 group-hover:text-primary transition-colors duration-300" />
                <span className="group-hover:text-primary transition-colors duration-300">View Portfolio</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 group-hover:text-primary transition-all duration-300" />
              </motion.div>
            </Button>
          </Link>

          <Link href="/playground">
            <button className="group relative min-w-[180px] px-6 py-3">
              {/* Main button background with double border effect */}
              <div className="absolute inset-0 bg-primary/20 rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50 blur-xl group-hover:blur-2xl transition-all duration-500 rounded-lg" />
              <div className="absolute inset-0 bg-black rounded-lg" />
              
              {/* Animated border */}
              <div className="absolute inset-[1px] bg-gradient-to-r from-primary via-accent to-primary rounded-lg">
                <div className="absolute inset-[1px] bg-black rounded-lg" />
              </div>
              
              {/* Moving background patterns */}
              <div className="absolute inset-[1px] rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shimmer_3s_linear_infinite]" />
                <div className="absolute inset-0 opacity-50">
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary to-transparent absolute top-[20%] -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-accent to-transparent absolute top-[40%] translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary to-transparent absolute top-[60%] -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-accent to-transparent absolute top-[80%] translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
                </div>
              </div>
              
              {/* Content */}
              <div className="relative flex items-center justify-center gap-3 text-white">
                <TerminalIcon className="h-5 w-5 transform transition-all duration-500 group-hover:scale-110 group-hover:text-primary" />
                <span className="font-medium tracking-wider transform transition-all duration-500">
                  Try Playground
                </span>
                <Rocket className="h-5 w-5 transform transition-all duration-500 group-hover:-rotate-45 group-hover:translate-x-1 group-hover:text-accent" />
              </div>
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 h-[2px] w-[10px] bg-primary" />
              <div className="absolute top-0 left-0 h-[10px] w-[2px] bg-primary" />
              <div className="absolute top-0 right-0 h-[2px] w-[10px] bg-accent" />
              <div className="absolute top-0 right-0 h-[10px] w-[2px] bg-accent" />
              <div className="absolute bottom-0 left-0 h-[2px] w-[10px] bg-primary" />
              <div className="absolute bottom-0 left-0 h-[10px] w-[2px] bg-primary" />
              <div className="absolute bottom-0 right-0 h-[2px] w-[10px] bg-accent" />
              <div className="absolute bottom-0 right-0 h-[10px] w-[2px] bg-accent" />
            </button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8"
      >
        <MouseScroll />
      </motion.div>
    </div>
  );
}
