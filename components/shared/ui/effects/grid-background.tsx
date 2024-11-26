'use client';

import React from "react";
import { motion } from "framer-motion";

export const GridBackground = () => {
  return (
    <div className="fixed inset-0 -z-50">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_50%,rgba(0,0,0,0),rgba(0,0,0,0.6))]" />
      </div>

      {/* Glowing orbs */}
      <div className="absolute inset-0">
        {/* Top left orb */}
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
        />

        {/* Bottom right orb */}
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
        />
      </div>

      {/* Animated lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -100 }}
            animate={{
              opacity: [0, 1, 0],
              x: ["0%", "100%"],
              y: [
                `${20 + i * 25}%`,
                `${20 + i * 25}%`,
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
            className="absolute h-px w-32 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          />
        ))}
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.4)_160%)]" />
    </div>
  );
};
