'use client';

import { type ReactNode } from 'react';
import AuthProvider from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';
import { TerminalProvider } from '@/providers/TerminalProvider';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { Toaster } from '@/components/shared/ui/feedback/toaster';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
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
              {children}
              <Toaster />
            </ToastPrimitive.Provider>
          </TooltipPrimitive.Provider>
        </TerminalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
