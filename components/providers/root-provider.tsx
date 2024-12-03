'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from './auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { TerminalProvider } from '@/providers/TerminalProvider';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ToastProvider } from '../shared/ui/toast';
import { Session } from 'next-auth';

interface ProvidersProps {
  children: ReactNode;
}

interface RootProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export function RootProvider({ children, session }: RootProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider session={session}>
        <TerminalProvider>
          <TooltipPrimitive.Provider>
            <ToastProvider>
              {children}
            </ToastPrimitive.Provider>
          </TerminalProvider>
        </AuthProvider>
      </ThemeProvider>
  );
}
