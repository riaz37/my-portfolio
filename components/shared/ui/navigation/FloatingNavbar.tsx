'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface FloatingNavProps {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
}

export default function FloatingNav({ navItems }: FloatingNavProps) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);

  // Transform values for background opacity and blur
  const backgroundOpacity = useTransform(
    scrollY,
    [0, 50],
    [0.1, hasScrolled ? 0.8 : 0.1]
  );
  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(8px)", "blur(12px)"]
  );

  // Update hasScrolled state
  useEffect(() => {
    const updateHasScrolled = () => {
      setHasScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", updateHasScrolled);
    return () => window.removeEventListener("scroll", updateHasScrolled);
  }, []);

  return (
    <motion.div 
      className="fixed left-0 right-0 top-4 z-50 mx-auto flex w-fit px-4 sm:px-0"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
    >
      <motion.nav 
        className="relative flex space-x-1 sm:space-x-2 rounded-full border border-white/10 p-1.5 sm:p-2"
        style={{
          backgroundColor: hasScrolled 
            ? "rgba(var(--background), 0.8)" 
            : "rgba(var(--background), 0.1)",
          backdropFilter: hasScrolled ? "blur(12px)" : "blur(8px)",
          transition: "background-color 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out",
        }}
      >
        {/* Background Glow */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"
          style={{
            opacity: backgroundOpacity,
            filter: "blur(20px)",
          }}
        />
        
        {/* Navigation Items */}
        <div className="relative flex space-x-0.5 sm:space-x-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.link;
            
            return (
              <Link
                key={item.link}
                href={item.link}
                className={cn(
                  "relative flex items-center space-x-1 sm:space-x-1.5 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-all duration-300",
                  {
                    "text-primary": isActive,
                    "text-muted-foreground/80 hover:text-primary hover:bg-primary/10": !isActive,
                  }
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-primary/15 dark:bg-primary/25"
                    style={{
                      backdropFilter: "blur(4px)",
                    }}
                    transition={{
                      type: "spring",
                      bounce: 0.15,
                      duration: 0.5
                    }}
                  />
                )}
                {item.icon && (
                  <span className="relative z-10 text-[0.9em] sm:text-base">{item.icon}</span>
                )}
                <span className="relative z-10 hidden sm:inline-block">{item.name}</span>
                <span className="relative z-10 sm:hidden">{item.name.charAt(0)}</span>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </motion.div>
  );
}
