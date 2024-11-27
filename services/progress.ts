import { ProgressStats } from '@/types/learningPath';
import { LearningProgress } from '@/models/user/LearningProgress';

export const progressService = {
  async getUserProgress(userId: string, learningPathId: string): Promise<ProgressStats | null> {
    try {
      let progress = await LearningProgress.findOne({ userId, learningPathId });
      
      if (!progress) {
        progress = await LearningProgress.create({ userId, learningPathId });
      }

      // Update last accessed time
      progress.lastAccessed = new Date();
      await progress.save();

      return progress.getStats();
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  },

  async markResourceComplete(
    userId: string,
    resourceId: string,
    skillId: string,
    learningPathId: string,
    completed: boolean
  ) {
    try {
      let progress = await LearningProgress.findOne({ userId, learningPathId });
      
      if (!progress) {
        progress = await LearningProgress.create({ userId, learningPathId });
      }

      if (completed) {
        await progress.markResourceComplete(resourceId, skillId);
      } else {
        await progress.markResourceIncomplete(resourceId, skillId);
      }

      return progress.getStats();
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  },

  async getLastAccessedPath(userId: string): Promise<string | null> {
    try {
      const lastProgress = await LearningProgress.findOne({ userId })
        .sort({ lastAccessed: -1 })
        .select('learningPathId');

      return lastProgress?.learningPathId || null;
    } catch (error) {
      console.error('Error getting last accessed path:', error);
      return null;
    }
  }
};
