'use client';

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-black shadow-lg hover:shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg hover:shadow-destructive/30 hover:bg-destructive/90 hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border-2 border-input bg-background shadow-sm hover:bg-primary/10 hover:text-primary hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lg hover:shadow-secondary/30 hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98]",
        ghost: 
          "hover:bg-primary/10 hover:text-primary hover:scale-[1.02] active:scale-[0.98]",
        link: 
          "text-primary underline-offset-4 hover:underline hover:scale-[1.02] active:scale-[0.98]",
        gradient: 
          "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-primary/30 bg-[length:200%_100%] animate-shimmer hover:scale-[1.02] active:scale-[0.98]",
        glow:
          "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.65)] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]",
        neon:
          "border-2 border-primary bg-transparent text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.65)] hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
        xl: "h-14 rounded-lg px-10 text-lg",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        spin: "animate-spin",
      },
      rounded: {
        default: "rounded-lg",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
      rounded: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    rounded,
    asChild = false, 
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const content = (
      <>
        {/* Button Content */}
        <span className="relative flex items-center justify-center gap-2">
          {isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {leftIcon && !isLoading && (
            <span>{leftIcon}</span>
          )}
          {children}
          {rightIcon && !isLoading && (
            <span>{rightIcon}</span>
          )}
        </span>
      </>
    );

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30,
          mass: 0.5,
        }}
      >
        <Comp
          className={cn(
            buttonVariants({ variant, size, animation, rounded, className }),
            "group",
            isLoading && "cursor-not-allowed opacity-80"
          )}
          ref={ref}
          disabled={disabled || isLoading}
          {...props}
        >
          {asChild ? children : content}
        </Comp>
      </motion.div>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
