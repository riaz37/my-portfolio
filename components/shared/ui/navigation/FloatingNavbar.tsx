'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingNavProps {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
}

export default function FloatingNav({ navItems }: FloatingNavProps) {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 right-0 top-4 z-50 mx-auto flex w-fit animate-nav-show">
      <nav className="relative flex space-x-2 rounded-full bg-white/30 p-2 backdrop-blur-lg dark:bg-gray-900/20">
        {/* Background Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 blur-xl" />
        
        {/* Navigation Items */}
        <div className="relative flex space-x-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.link;
            
            return (
              <Link
                key={item.link}
                href={item.link}
                className={cn(
                  "relative flex items-center space-x-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 hover:text-primary",
                  {
                    "text-primary": isActive,
                    "text-muted-foreground/80": !isActive,
                  }
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-accent/30 backdrop-blur-sm"
                    transition={{
                      type: "spring",
                      bounce: 0.3,
                      duration: 0.6
                    }}
                  />
                )}
                {item.icon && (
                  <span className="relative">{item.icon}</span>
                )}
                <span className="relative">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
