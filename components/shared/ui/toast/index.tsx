'use client';

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full max-w-md items-center justify-between space-x-4 overflow-hidden rounded-md p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[translate] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-right-full',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white dark:from-purple-600 dark:to-indigo-600',
        success: 'bg-gradient-to-r from-emerald-400 to-green-500 text-white',
        error: 'bg-gradient-to-r from-rose-500 to-red-500 text-white',
        warning: 'bg-gradient-to-r from-amber-300 to-yellow-500 text-black',
        info: 'bg-gradient-to-r from-sky-400 to-blue-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface ToastProps extends ToastPrimitive.ToastProps, VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  id: string;
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, variant, title, description, ...props }, ref) => {
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
      </div>
      <ToastPrimitive.Close
        className="absolute right-2 top-2 rounded-md p-1 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
});
Toast.displayName = 'Toast';

const useToast = (duration = 5000) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback(
    ({
      title,
      description,
      variant = 'default',
      duration: toastDuration = duration,
      ...props
    }: Omit<ToastProps, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastProps = {
        id,
        title,
        description,
        variant,
        duration: toastDuration,
        ...props,
      };

      setToasts((currentToasts) => [...currentToasts, newToast]);

      if (toastDuration !== Infinity) {
        setTimeout(() => {
          dismiss(id);
        }, toastDuration);
      }
    },
    [duration]
  );

  const dismiss = React.useCallback((toastId: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId)
    );
  }, []);

  return { toast, dismiss, toasts };
};

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts] = React.useState<ToastProps[]>([]);

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {children}
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] flex flex-col p-4" />
    </ToastPrimitive.Provider>
  );
};

export { Toast, ToastProvider, ToastPrimitive, useToast };
