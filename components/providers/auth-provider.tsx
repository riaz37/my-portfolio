'use client';

import { SessionProvider, SessionProviderProps } from 'next-auth/react';

export function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: SessionProviderProps['session'];
}) {
  return (
    <SessionProvider 
      session={session}
      // Refresh session every 5 minutes
      refetchInterval={5 * 60}
      // Enable refetch on window focus for real-time session updates
      refetchOnWindowFocus={true}
      // Enable refetch when reconnecting
      refetchWhenOffline={true}
    >
      {children}
    </SessionProvider>
  );
}
