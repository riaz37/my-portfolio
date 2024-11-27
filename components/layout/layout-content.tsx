"use client";

import React from "react";
import FloatingNav from "@/components/shared/ui/navigation/FloatingNavbar";
import { AuthProvider } from "@/components/providers/auth-provider";
import { GridBackground } from "@/components/shared/ui/effects/grid-background";
import { Toaster } from "@/components/shared/ui/feedback/toaster";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { NavigationProvider, useNavItems } from "@/components/shared/ui/navigation/NavigationProvider";
import { TerminalProvider } from "@/providers/TerminalProvider";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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
});

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <NavigationProvider>
      <MainContent pathname={pathname}>
        {children}
      </MainContent>
    </NavigationProvider>
  );
}

function MainContent({ children, pathname }: { children: React.ReactNode, pathname: string }) {
  const navItems = useNavItems();
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <GridBackground />
      
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navigation */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-0 z-40"
        >
          <FloatingNav navItems={navItems} />
        </motion.header>

        {/* Page Content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <PageTransition key={pathname}>
              {children}
            </PageTransition>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <Footer />
        </motion.footer>
      </div>

      {/* Terminal */}
      <Terminal />
      
      {/* Toaster */}
      <Toaster />
    </div>
  );
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TerminalProvider>
        <LayoutContent>
          {children}
        </LayoutContent>
      </TerminalProvider>
    </AuthProvider>
  );
}
