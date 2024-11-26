'use client';

import { useEffect } from 'react';
import { Button } from '@/components/shared/ui/core/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">
        {error.message || 'An unexpected error occurred'}
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => window.location.href = '/'}
          variant="outline"
        >
          Go Home
        </Button>
        <Button
          onClick={() => reset()}
          variant="default"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
