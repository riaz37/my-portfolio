'use client';

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
  onAnimationStart?: (definition: any) => void;
}

export function Section({ children, className, id, fullWidth = false, ...props }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, type: "spring" }}
      className={cn(
        "relative py-16 md:py-24",
        !fullWidth && "container mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background/0 opacity-50" />
      
      {/* Content */}
      <div className="relative">{children}</div>
    </motion.section>
  );
}

interface SectionTitleProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
  highlight?: string;
  badge?: string;
  align?: 'left' | 'center' | 'right';
  showDecoration?: boolean;
}

export function SectionTitle({ 
  children, 
  className, 
  subtitle,
  highlight,
  badge,
  align = 'center',
  showDecoration = true,
  ...props 
}: SectionTitleProps) {
  const words = typeof children === 'string' ? children.split(' ') : [children];
  
  return (
    <div className={cn(
      "flex flex-col gap-6",
      {
        'items-center text-center': align === 'center',
        'items-start text-left': align === 'left',
        'items-end text-right': align === 'right'
      },
      className
    )}>
      {/* Badge */}
      {badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/[0.08] rounded-full ring-1 ring-primary/20 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {badge}
        </motion.div>
      )}

      {/* Main Title Container */}
      <div className="space-y-4">
        {/* Title */}
        <div className="relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
              "text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text",
            )}
            {...props}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className="inline-block"
              >
                <span className={cn(
                  "mr-2 relative",
                  highlight && word === highlight ? "text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary" : "text-foreground"
                )}>
                  {word}
                  {highlight && word === highlight && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                      className="absolute -bottom-2 left-0 right-0 h-[3px] origin-left rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/50"
                    />
                  )}
                </span>
              </motion.span>
            ))}
          </motion.h2>

          {/* Decorative Elements */}
          {showDecoration && (
            <>
              {/* Left Decoration */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "absolute -left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 -rotate-45",
                  align === 'right' && "hidden"
                )}
              >
                <div className="h-1 w-6 rounded-full bg-gradient-to-r from-primary to-primary/30" />
                <div className="h-1 w-2 rounded-full bg-primary/40" />
              </motion.div>

              {/* Right Decoration */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "absolute -right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 rotate-45",
                  align === 'left' && "hidden"
                )}
              >
                <div className="h-1 w-2 rounded-full bg-primary/40" />
                <div className="h-1 w-6 rounded-full bg-gradient-to-r from-primary/30 to-primary" />
              </motion.div>
            </>
          )}
        </div>

        {/* Subtitle with gradient fade */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {subtitle}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </motion.p>
        )}
      </div>
    </div>
  );
}

export function SectionHeader({ children, className, ...props }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn("mb-12 text-center", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SectionDescription({ children, className, ...props }: SectionProps) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={cn(
        "mx-auto mt-4 max-w-3xl text-center text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </motion.p>
  );
}

export function SectionContent({ children, className, ...props }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className={cn("relative mt-12", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
