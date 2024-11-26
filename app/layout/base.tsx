'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from '@/components/shared/ui/animated-background';
import { Providers } from '@/app/providers';
import FloatingNav from '@/components/shared/ui/navigation/FloatingNavbar';
import { cn } from '@/lib/utils';

interface BaseLayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  const pathname = usePathname();

  return (
    <Providers>
      <AnimatePresence mode="wait">
        <AnimatedBackground
          key={pathname}
          className={cn(
            "antialiased font-sans",
            "selection:bg-primary/20 selection:text-primary"
          )}
        >
          <div className="relative flex min-h-screen flex-col">
            <FloatingNav />
            <main className="flex-1">{children}</main>
          </div>
        </AnimatedBackground>
      </AnimatePresence>
    </Providers>
  );
}
