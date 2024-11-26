'use client';

import { ReactNode } from 'react';

interface BackgroundProps {
  children: ReactNode;
}

export function Background({ children }: BackgroundProps) {
  return (
    <div className="relative min-h-screen">
      {children}
    </div>
  );
}
