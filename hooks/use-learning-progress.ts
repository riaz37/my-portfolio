import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ProgressStats } from '@/types/learningPath';

export function useLearningProgress(learningPathId: string | null) {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch progress when component mounts or learningPathId changes
  useEffect(() => {
    if (learningPathId && session?.user) {
      fetchProgress();
    }
  }, [learningPathId, session?.user]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/learning-paths/progress?learningPathId=${learningPathId}`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      
      const data = await response.json();
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast.error('Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const markResourceComplete = async (
    resourceId: string,
    skillId: string,
    completed: boolean
  ) => {
    if (!learningPathId || !session?.user) {
      toast.error('Please sign in to track progress');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/learning-paths/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId,
          skillId,
          learningPathId,
          completed,
        }),
      });

      if (!response.ok) throw new Error('Failed to update progress');

      const data = await response.json();
      setProgress(data);
      
      toast.success(completed ? 'Resource marked as complete!' : 'Resource marked as incomplete');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  return {
    progress,
    loading,
    markResourceComplete,
  };
}
