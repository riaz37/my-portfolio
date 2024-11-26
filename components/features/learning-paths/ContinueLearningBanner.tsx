'use client';

import { Card } from '@/components/shared/ui/data-display/card';
import { Button } from '@/components/shared/ui/core/button';
import { Progress } from '@/components/shared/ui/feedback/progress';
import { LearningPath } from '@/types/learningPath';
import { ProgressStats } from '@/types/learningPath';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface ContinueLearningBannerProps {
  learningPath: LearningPath;
  progress: ProgressStats | null;
  loading?: boolean;
}

export const ContinueLearningBanner: React.FC<ContinueLearningBannerProps> = ({
  learningPath,
  progress,
  loading = false,
}) => {
  const completedResources = progress?.completedResources?.length || 0;
  const totalResources = learningPath.skills.reduce(
    (total, skill) => total + skill.resources.length,
    0
  );
  const percentComplete = totalResources > 0 
    ? Math.round((completedResources / totalResources) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Continue Learning</h3>
          </div>
          <Button variant="outline" size="sm">
            View Progress
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                {completedResources} of {totalResources} resources completed
              </p>
              <span className="text-sm font-medium">{percentComplete}%</span>
            </div>
            <Progress value={percentComplete} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Next Up:</h4>
              <p className="text-sm text-muted-foreground">
                {progress?.lastAccessedResource?.title || learningPath.skills[0]?.resources[0]?.title || 'Start your journey'}
              </p>
            </div>
            <Button>Continue</Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
