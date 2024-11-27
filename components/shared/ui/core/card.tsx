'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  variant?: 'default' | 'glass' | 'outline' | 'solid' | 'gradient';
  size?: 'sm' | 'default' | 'lg';
  hover?: 'none' | 'scale' | 'lift' | 'glow';
}

const variants = {
  default: "bg-card text-card-foreground shadow-sm",
  glass: "bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl backdrop-saturate-150 border border-white/20 dark:border-gray-800/50",
  outline: "border-2 border-border bg-transparent",
  solid: "bg-primary text-primary-foreground shadow-lg",
  gradient: "bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground shadow-lg",
};

const sizes = {
  sm: "p-4",
  default: "p-6",
  lg: "p-8",
};

const hovers = {
  none: "",
  scale: "hover:scale-[1.02] active:scale-[0.98]",
  lift: "hover:-translate-y-2",
  glow: "hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.35)]",
};

export function Card({ 
  children, 
  className, 
  interactive = false,
  variant = 'default',
  size = 'default',
  hover = 'none',
  ...props 
}: CardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`radial-gradient(
    circle at \${mouseX}px \${mouseY}px,
    rgba(var(--primary-rgb), 0.1),
    transparent 80%
  )`;

  return (
    <motion.div
      whileHover={interactive ? { scale: 1.02, y: -5 } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        mass: 0.5 
      }}
      onMouseMove={onMouseMove}
      className={cn(
        // Base styles
        "relative overflow-hidden rounded-xl",
        "transition-all duration-300 ease-out",
        variants[variant],
        sizes[size],
        interactive && hovers[hover],
        
        // Group hover effects
        "group/card",
        interactive && [
          "cursor-pointer",
          "hover:shadow-lg dark:hover:shadow-primary/20",
        ],
        
        className
      )}
      {...props}
    >
      {/* Mouse follow gradient */}
      {interactive && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
          style={{ background }}
        />
      )}
      
      {/* Spotlight gradient effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500",
          "bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.1),transparent_50%)]",
          "group-hover/card:opacity-100"
        )}
      />
      
      {/* Border gradient */}
      <div 
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500",
          "bg-gradient-to-b from-primary/10 via-accent/5 to-transparent",
          "group-hover/card:opacity-100"
        )}
      />

      {/* Content */}
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "mb-4 space-y-1.5",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardProps) {
  return (
    <h3 
      className={cn(
        "text-2xl font-semibold tracking-tight",
        "bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent",
        "dark:from-gray-100 dark:to-gray-400",
        "transition-colors duration-300",
        "group-hover/card:from-primary group-hover/card:to-accent",
        className
      )} 
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: CardProps) {
  return (
    <p 
      className={cn(
        "text-sm text-muted-foreground",
        "leading-relaxed",
        "transition-colors duration-300",
        className
      )} 
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "space-y-4",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "mt-6 flex items-center justify-between",
        "pt-4 border-t border-border",
        "transition-colors duration-300",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
