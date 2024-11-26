// components/sections/Hero.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/shared/ui/core/button';
import { ArrowRight, Mail, Rocket, Terminal as TerminalIcon, ArrowDown, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { BackgroundBeams } from '@/components/shared/ui/effects/background-beams';
import { MouseScroll } from '@/components/shared/ui/mouse-scroll';
import  Terminal  from '@/components/features/Terminal';


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

const glowVariant = {
  initial: {
    opacity: 0.5,
    scale: 1,
  },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.2, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
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
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
      <BackgroundBeams />
      
      {/* Decorative Elements */}
      <motion.div
        variants={glowVariant}
        initial="initial"
        animate="animate"
        className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        variants={glowVariant}
        initial="initial"
        animate="animate"
        className="absolute bottom-1/4 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
      />
      
      <div className="text-center space-y-8 relative z-10 px-4">
        <motion.div
          variants={fadeInUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="space-y-4"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1, bounce: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-xl opacity-50" />
              <Image
                priority
                src="/profile.svg"
                alt="Riaz's Profile"
                width={280}
                height={280}
                className="rounded-full bg-muted p-3 md:p-6 object-cover"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h2 className="text-sm sm:text-base text-muted-foreground font-medium tracking-wider uppercase">
              Welcome to my world
            </h2>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight">
              Hi, I'm{" "}
              <span className="inline-block animate-gradient-x bg-gradient-to-r from-violet-500 via-primary to-violet-500 bg-[length:200%_auto] bg-clip-text text-transparent">
                Riaz
              </span>
            </h1>
          </motion.div>

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
        </motion.div>

        <motion.p
          variants={fadeInUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed"
        >
          Turning coffee into code and passion into knowledge. Let's build something amazing together.
        </motion.p>

        <motion.div
          variants={fadeInUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.6}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <Link href="/portfolio">
            <Button
              size="lg"
              variant="outline"
              className="group relative overflow-hidden hover:border-primary/50 transition-all duration-300 min-w-[160px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-primary/20 to-violet-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                <LayoutGrid className="h-4 w-4 group-hover:text-black transition-colors duration-300" />
                <span className="group-hover:text-black transition-colors duration-300">View Portfolio</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 group-hover:text-black transition-all duration-300" />
              </motion.div>
            </Button>
          </Link>
          <Link href="/playground">
            <Button
              size="lg"
              className="relative group overflow-hidden min-w-[160px] bg-transparent border-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#FF0080] blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#FF0080] animate-gradient-x group-hover:animate-gradient-x-fast" />
              <div className="relative bg-background/10 backdrop-blur-sm px-4 py-2 rounded-md border border-white/10 shadow-2xl">
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center gap-2 text-white font-medium"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      rotate: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      },
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <Rocket className="h-4 w-4" />
                  </motion.div>
                  Try Playground
                  <motion.div
                    animate={{ 
                      x: [0, 6, 0],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </motion.div>
              </div>
            </Button>
          </Link>
        </motion.div>

        {/* Terminal Feature Indicator */}
        <motion.div
          variants={fadeInUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.8}
          className="mt-12 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 backdrop-blur-sm"
          >
            <TerminalIcon className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Press <kbd className="px-2 py-0.5 text-xs font-mono bg-secondary/30 rounded-md mx-1">Ctrl</kbd>
              +
              <kbd className="px-2 py-0.5 text-xs font-mono bg-secondary/30 rounded-md mx-1">/</kbd>
              to open terminal
            </span>
            <motion.div
              animate={{
                y: [0, -4, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ArrowDown className="h-4 w-4 text-primary" />
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="relative">
          {/* Terminal */}
          <Terminal />
        </div>

      </div>

      {/* Mouse Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8"
      >
        <MouseScroll />
      </motion.div>
    </section>
  );
}
