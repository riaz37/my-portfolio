'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider 
      // Refresh session every 5 minutes
      refetchInterval={5 * 60}
      // Disable refetch on window focus for better performance
      refetchOnWindowFocus={false}
      // Enable refetch when reconnecting
      refetchWhenOffline={true}
    >
      {children}
    </SessionProvider>
  );
}
