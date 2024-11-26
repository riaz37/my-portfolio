'use client';

import { Session } from 'next-auth';
import { Background } from './background';
import { PlaygroundPage } from '@/components/features/playground/PlaygroundPage';

interface ClientWrapperProps {
  session: Session | null;
}

export function ClientWrapper({ session }: ClientWrapperProps) {
  return (
    <Background>
      <div className="min-h-screen relative">
        {/* Animated background elements */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-l from-primary/5 to-transparent opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/2 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary/5 to-transparent opacity-20 blur-3xl" />
        </div>

        {/* Main content */}
        <main className="container mx-auto px-4 py-12">
          <PlaygroundPage session={session} />
        </main>
      </div>
    </Background>
  );
}
