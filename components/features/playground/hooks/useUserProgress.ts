'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/useToast';

export function useUserProgress() {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (session?.user) {
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
            variant: 'destructive',
          });
        }
      }
      setIsLoading(false);
    };

    fetchUserProgress();
  }, [session, toast]);

  return { progress, isLoading };
}
