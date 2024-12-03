'use client';

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[translate] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full',
  {
    variants: {
      variant: {
        default: 'border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50',
        success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800/50 dark:bg-green-900/50 dark:text-green-50',
        error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800/50 dark:bg-red-900/50 dark:text-red-50',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800/50 dark:bg-yellow-900/50 dark:text-yellow-50',
        info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800/50 dark:bg-blue-900/50 dark:text-blue-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>, VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  id: string;
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, variant, title, description, children, ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <div className="grid gap-1">
        {title && (
          <ToastPrimitive.Title className="text-sm font-semibold">
            {title}
          </ToastPrimitive.Title>
        )}
        {description && (
          <ToastPrimitive.Description className="text-sm opacity-90">
            {description}
          </ToastPrimitive.Description>
        )}
        {children}
      </div>
      <ToastPrimitive.Close className="absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
});
Toast.displayName = 'Toast';

const useToast = (duration = 5000) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback(
    (toastOptions: Omit<ToastProps, 'id'>) => {
      const { title, description, variant = 'default', duration: toastDuration = duration, ...props } = toastOptions;
      
      // Prevent duplicate toasts
      const isDuplicate = toasts.some(
        t => t.title === title && t.description === description
      );

      if (isDuplicate) return null;

      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastProps = {
        id,
        title,
        description,
        variant,
        duration: toastDuration,
        ...props,
      };

      // Limit total number of toasts
      const updatedToasts = toasts.length >= 5 
        ? toasts.slice(1) 
        : toasts;

      // Use a microtask to prevent maximum update depth
      queueMicrotask(() => {
        setToasts([...updatedToasts, newToast]);
      });

      if (toastDuration !== Infinity) {
        setTimeout(() => {
          dismiss(id);
        }, toastDuration);
      }

      return id;
    },
    [duration, toasts]
  );

  const dismiss = React.useCallback((toastId: string) => {
    queueMicrotask(() => {
      setToasts(currentToasts => 
        currentToasts.filter(toast => toast.id !== toastId)
      );
    });
  }, []);

  const dismissAll = React.useCallback(() => {
    queueMicrotask(() => {
      setToasts([]);
    });
  }, []);

  return { toast, dismiss, dismissAll, toasts };
};

function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider>
      {children}
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]" />
    </ToastPrimitive.Provider>
  );
}

export { Toast, ToastProvider, useToast };
