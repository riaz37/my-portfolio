'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from './auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { TerminalProvider } from '@/providers/TerminalProvider';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { ToastContextProvider } from '../shared/ui/toast/toast-wrapper';



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
              <ToastContextProvider>
                {children}
              </ToastContextProvider>
            </ToastPrimitive.Provider>
          </TooltipPrimitive.Provider>
        </TerminalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
