'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from './auth-provider';
import { ThemeProvider } from '../theme-provider';
import { TerminalProvider } from '@/providers/TerminalProvider';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ToastContextProvider } from '../shared/ui/toast/toast-wrapper';
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
    <AuthProvider session={session}>
      <ThemeProvider>
        <TooltipPrimitive.Provider>
          <TerminalProvider>
            <ToastContextProvider>
              {children}
            </ToastContextProvider>
          </TerminalProvider>
        </TooltipPrimitive.Provider>
      </ThemeProvider>
    </AuthProvider>
  );
}
