'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';

export function useUserProgress() {
  const { status } = useSession();
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useCustomToast();
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (status === 'authenticated' && !hasFetched.current) {
        hasFetched.current = true;
        try {
          const response = await fetch('/api/user/progress');
          if (!response.ok) {
            throw new Error('Failed to fetch progress');
          }
          const data = await response.json();
          setProgress(data.progress || {});
        } catch (error) {
          console.error('Error fetching user progress:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch your progress. Please try again later.',
            variant: 'error',
          });
        } finally {
          setIsLoading(false);
        }
      } else if (status !== 'loading') {
        setIsLoading(false);
      }
    };

    fetchUserProgress();
  }, [status]);

  return { progress, isLoading };
}
