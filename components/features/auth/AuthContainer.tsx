'use client';

import { type ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/components/shared/ui/core/card';

interface AuthContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthContainer({ children, title, subtitle }: AuthContainerProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md backdrop-blur-sm bg-card/50">
        <CardHeader className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
