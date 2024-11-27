'use client';

import { motion } from 'framer-motion';

export const AnimatedGradientBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Base layer with light background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white/98 dark:from-background dark:via-background dark:to-background/98" />
      
      {/* Animated gradient layers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        {/* Light mode gradients */}
        <div className="light:block dark:hidden">
          {/* Soft purple gradient */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-purple-50/30 via-violet-50/20 to-transparent animate-gradient-y" />
          
          {/* Soft blue gradient */}
          <div className="absolute top-1/4 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-50/20 via-sky-50/15 to-transparent animate-gradient-y-fast" />
          
          {/* Accent gradient */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-violet-50/20 via-primary/10 to-transparent animate-gradient-y" />
          
          {/* Moving highlight */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent rotate-45 animate-pulse-soft" />
          </div>
        </div>

        {/* Dark mode gradients */}
        <div className="hidden dark:block">
          {/* Deep purple gradient */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-purple-950/10 via-violet-950/8 to-transparent animate-gradient-y" />
          
          {/* Deep blue gradient */}
          <div className="absolute top-1/4 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-950/8 via-sky-950/5 to-transparent animate-gradient-y-fast" />
          
          {/* Accent gradient */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-violet-950/8 via-primary/5 to-transparent animate-gradient-y" />
          
          {/* Moving highlight */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent rotate-45 animate-pulse-soft" />
          </div>
        </div>
      </motion.div>

      {/* Ultra subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.08] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
};
