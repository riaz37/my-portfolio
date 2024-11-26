import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none text-white",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-black font-medium shadow-md transition-colors hover:bg-primary/90 hover:text-black active:scale-[0.98] disabled:opacity-50",
        destructive:
          "bg-destructive text-destructive-foreground font-medium shadow-md transition-colors hover:bg-destructive/90 hover:text-black active:scale-[0.98] disabled:opacity-50",
        outline:
          "border-2 border-input bg-background font-medium shadow-sm transition-colors hover:bg-accent hover:text-black active:scale-[0.98] disabled:opacity-50",
        secondary:
          "bg-secondary text-black font-medium shadow-md transition-colors hover:bg-secondary/80 hover:text-black active:scale-[0.98] disabled:opacity-50",
        ghost: 
          "text-foreground hover:bg-accent hover:text-black transition-colors active:scale-[0.98] disabled:opacity-50",
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-black inline-flex items-center gap-1 hover:gap-2 transition-all",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {typeof children === 'string' ? children : 'Loading...'}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
