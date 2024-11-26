"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Slide transition variant
export const slideVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    }
  },
  exit: { 
    opacity: 0,
    x: 20,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    }
  }
};

// Fade up transition variant
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    }
  }
};
