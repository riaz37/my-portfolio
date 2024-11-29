'use client';

import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';

import * as ToastPrimitive from '@radix-ui/react-toast';
import { ToastContextProvider } from '@/components/shared/ui/toast/toast-wrapper';
import FloatingNav from '@/components/shared/ui/navigation/FloatingNavbar';
import { useNavItems } from '@/components/shared/ui/navigation/NavItems';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = useNavItems();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <ToastPrimitive.Provider>
          <ToastContextProvider>
            <div className="relative min-h-screen bg-background">
              <FloatingNav navItems={navItems} />
              {/* Main content */}
              <main className="container mx-auto px-4 py-12 pt-20">
                {children}
              </main>
            </div>
            {/* Toasts will be rendered by ToastContextProvider */}
          </ToastContextProvider>
        </ToastPrimitive.Provider>
      </AuthProvider>
    </ThemeProvider>
  );
}
