import { useState, useEffect } from 'react';
import { Session } from 'next-auth';

interface Progress {
  [key: string]: number;
}

export function useUserProgress() {
  const [progress, setProgress] = useState<Progress>({});
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading progress data
  useEffect(() => {
    const loadProgress = async () => {
      // In a real app, this would fetch from your API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setProgress({
        '/playground/challenges-list': 45,
        '/playground/learning-paths': 30,
        '/playground/practice-arena': 15,
      });
      setIsLoading(false);
    };

    loadProgress();
  }, []);

  return { progress, isLoading };
}
