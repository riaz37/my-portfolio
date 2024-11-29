'use client';

import { Session } from 'next-auth';
import dynamic from 'next/dynamic';

const PlaygroundPage = dynamic(
  () => import('@/components/features/playground/PlaygroundPage').then(mod => mod.PlaygroundPage),
  { ssr: false }
);

interface ClientWrapperProps {
  session: Session | null;
}

export function ClientWrapper({ session }: ClientWrapperProps) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <PlaygroundPage session={session} />
      </main>
    </div>
  );
}
