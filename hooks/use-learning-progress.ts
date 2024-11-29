import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export const useLearningProgress = (learningPathId: string | null) => {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const markResourceComplete = useCallback(async (resourceId: string) => {
    if (!session?.user) return;

    setLoading(true);
    try {
      const response = await fetch('/api/learning-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          learningPathId,
          resourceId,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark resource as complete');
      }

      setProgress(prev => ({
        ...prev,
        [resourceId]: true,
      }));
    } catch (error) {
      console.error('Error marking resource complete:', error);
    } finally {
      setLoading(false);
    }
  }, [learningPathId, session]);

  return { progress, loading, markResourceComplete };
};
