'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from './auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { TerminalProvider } from '@/providers/TerminalProvider';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { Toaster } from '@/components/shared/ui/feedback/toaster';
import { ThemeToggle } from '@/components/theme-toggle';

interface ProvidersProps {
  children: ReactNode;
}

export function RootProvider({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <TerminalProvider>
          <TooltipPrimitive.Provider>
            <ToastPrimitive.Provider>
              <ThemeToggle />
              {children}
              <Toaster />
            </ToastPrimitive.Provider>
          </TooltipPrimitive.Provider>
        </TerminalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
