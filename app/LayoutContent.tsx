"use client";

import React from "react";
import { ThemeProvider } from "@/app/ThemeProvider";
import FloatingNav from "@/components/shared/ui/navigation/FloatingNavbar";
import AuthProvider from "@/app/AuthProvider";
import { DynamicBackground } from "@/components/ui/dynamic-background";
import { Toaster } from "sonner";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { NavigationProvider, useNavItems } from "@/components/shared/ui/navigation/NavigationProvider";
import { TerminalProvider } from "@/providers/TerminalProvider";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Footer = dynamic(() => import("@/components/layout/sections/Footer"), {
  ssr: true,
  loading: () => <div className="h-16" />,
});

const PageTransition = dynamic(
  () => import("@/components/shared/ui/PageTransition"),
  {
    ssr: false,
    loading: () => <div className="min-h-screen" />,
  }
);

const Terminal = dynamic(() => import("@/components/features/Terminal"), {
  ssr: false,
  loading: () => null,
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItems = useNavItems();

  return (
    <AnimatePresence mode="wait">
      <DynamicBackground key={pathname}>
        <div className="relative min-h-screen flex flex-col">
          <header className="fixed inset-x-0 top-0 z-50 flex justify-center">
            <FloatingNav navItems={navItems} />
          </header>
          <main className="flex-1 pt-16">
            <Suspense fallback={<div className="min-h-screen" />}>
              <PageTransition>{children}</PageTransition>
            </Suspense>
          </main>
          <Suspense fallback={<div className="h-16" />}>
            <Footer />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <Terminal />
        </Suspense>
        <Toaster position="bottom-right" />
      </DynamicBackground>
    </AnimatePresence>
  );
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <NavigationProvider>
          <TerminalProvider>
            <LayoutContent>{children}</LayoutContent>
          </TerminalProvider>
        </NavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
