'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from './auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { TerminalProvider } from '@/providers/TerminalProvider';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ToastProvider } from '../shared/ui/toast';

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
            <ToastProvider>
              {children}
            </ToastProvider>
          </TooltipPrimitive.Provider>
        </TerminalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
