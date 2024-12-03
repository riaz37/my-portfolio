import { useState, useEffect } from 'react';
import { CareerPath, LearningPath, Skill } from '@/types/learningPath';

interface ProgressState {
  completedSkills: Set<string>;
  lastUpdated: number;
  currentStreak: number;
  lastCompletedDate?: string;
}

export function useLearningProgress() {
  const [progress, setProgress] = useState<ProgressState>({
    completedSkills: new Set<string>(),
    lastUpdated: Date.now(),
    currentStreak: 0,
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('learningProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setProgress({
        ...parsed,
        completedSkills: new Set(parsed.completedSkills),
      });
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('learningProgress', JSON.stringify({
      ...progress,
      completedSkills: Array.from(progress.completedSkills),
    }));
  }, [progress]);

  const completeSkill = (skillId: string) => {
    setProgress(prev => {
      const newSkills = new Set(prev.completedSkills);
      
      if (newSkills.has(skillId)) {
        newSkills.delete(skillId);
      } else {
        newSkills.add(skillId);
        // Update streak only when completing new skills
        const today = new Date().toDateString();
        if (prev.lastCompletedDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const isConsecutive = prev.lastCompletedDate === yesterday.toDateString();
          return {
            ...prev,
            completedSkills: newSkills,
            currentStreak: isConsecutive ? prev.currentStreak + 1 : 1,
            lastCompletedDate: today,
            lastUpdated: Date.now(),
          };
        }
      }

      return {
        ...prev,
        completedSkills: newSkills,
        lastUpdated: Date.now(),
      };
    });
  };

  const calculatePathProgress = (path: CareerPath): number => {
    const allSkills = path.learningPaths.flatMap(lp => lp.skills);
    if (allSkills.length === 0) return 0;
    
    const completedCount = allSkills.filter(skill => 
      progress.completedSkills.has(skill.id)
    ).length;
    
    return Math.round((completedCount / allSkills.length) * 100);
  };

  const calculateLearningPathProgress = (learningPath: LearningPath): number => {
    if (learningPath.skills.length === 0) return 0;
    
    const completedCount = learningPath.skills.filter(skill =>
      progress.completedSkills.has(skill.id)
    ).length;
    
    return Math.round((completedCount / learningPath.skills.length) * 100);
  };

  const isSkillAvailable = (skill: Skill): boolean => {
    if (!skill.prerequisites) return true;
    return skill.prerequisites.every(prereq => progress.completedSkills.has(prereq));
  };

  return {
    completedSkills: progress.completedSkills,
    currentStreak: progress.currentStreak,
    completeSkill,
    calculatePathProgress,
    calculateLearningPathProgress,
    isSkillAvailable,
  };
}
