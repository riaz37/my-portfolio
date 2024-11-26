'use client';

import { useState, useEffect } from 'react';
import { AnimatedBackground } from "./animated-background";
import { GridBackground } from "./grid-background";
import { motion, AnimatePresence } from "framer-motion";

export function DynamicBackground() {
  const [backgroundType, setBackgroundType] = useState<"animated" | "grid">("animated");

  useEffect(() => {
    // Switch background every 30 seconds
    const interval = setInterval(() => {
      setBackgroundType((prev) => (prev === "animated" ? "grid" : "animated"));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={backgroundType}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 -z-10"
      >
        {backgroundType === "animated" ? <AnimatedBackground /> : <GridBackground />}
      </motion.div>
    </AnimatePresence>
  );
};
