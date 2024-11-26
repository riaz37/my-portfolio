'use client';

import { memo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  link: string;
  icon: React.ReactNode;
}

interface FloatingNavProps {
  className?: string;
  navItems: NavItem[];
}

const FloatingNavbar = memo(({ className, navItems = [] }: FloatingNavProps) => {
  const pathname = usePathname();

  const isActive = useCallback((link: string) => {
    if (link.startsWith('/#')) {
      return pathname === '/';
    }
    return pathname === link;
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "relative top-4 mx-auto z-40",
          className
        )}
      >
        <motion.div
          className={cn(
            "relative px-4 py-2 rounded-full",
            "bg-white/80 dark:bg-gray-950/80",
            "backdrop-blur-md backdrop-saturate-150",
            "border border-gray-200 dark:border-gray-800",
            "shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
          )}
        >
          <ul className="flex items-center gap-2">
            {navItems.map(({ name, link, icon }) => (
              <motion.li key={link} className="relative">
                <Link
                  href={link}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium",
                    "flex items-center gap-2 relative z-20",
                    "transition-colors duration-200",
                    "text-gray-700 dark:text-gray-300",
                    "hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  {icon}
                  <span>{name}</span>
                </Link>
                {isActive(link) && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 z-10 rounded-full bg-gray-100 dark:bg-gray-800"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

FloatingNavbar.displayName = "FloatingNavbar";

export default FloatingNavbar;
