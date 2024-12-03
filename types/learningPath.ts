export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type ResourceType = 'documentation' | 'tutorial' | 'practice';

export type RoadmapCategory = 'frontend' | 'backend' | 'interview';

export type SkillStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  estimatedTime: string;
  priority: 'required' | 'recommended' | 'optional';
  objectives?: string[];
  tags: string[];
  completed?: boolean;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  level: SkillLevel;
  status: SkillStatus;
  icon: string;
  order: number;
  prerequisites?: string[]; // IDs of prerequisite skills
  resources: Resource[];
  estimatedDays: number;
  keyTakeaways: string[];
  completed?: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: RoadmapCategory;
  level: SkillLevel;
  icon: string;
  order: number;
  skills: Skill[];
  prerequisites?: string[]; // IDs of prerequisite learning paths
  estimatedWeeks: number;
  objectives: string[];
  milestones: {
    id: string;
    title: string;
    description: string;
    requiredSkills: string[]; // IDs of required skills
    projectPrompt?: string;
  }[];
  completed?: boolean;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  category: RoadmapCategory;
  icon: string;
  learningPaths: LearningPath[];
  overview: {
    description: string;
    jobProspects: string[];
    requiredSkills: string[];
    estimatedTimeToMastery: string;
  };
  progressStats?: {
    totalPaths: number;
    completedPaths: number;
    totalSkills: number;
    completedSkills: number;
    totalResources: number;
    completedResources: number;
    percentageComplete: number;
    currentMilestone?: string;
    nextMilestone?: string;
    estimatedTimeRemaining?: string;
  };
}

export interface UserProgress {
  userId: string;
  resourceId: string;
  skillId: string;
  learningPathId: string;
  completed: boolean;
  lastAccessed: Date;
  completedAt?: Date;
  notes?: string;
  timeSpent?: number; // in minutes
}

export interface ProgressStats {
  totalResources: number;
  completedResources: number;
  currentSkill: string;
  lastAccessedResource: string;
  percentageComplete: number;
  streak: number;
  lastStudyDate?: Date;
  totalStudyTime: number; // in minutes
  milestones: {
    id: string;
    completed: boolean;
    completedAt?: Date;
  }[];
}

export interface LearningPathWithProgress extends LearningPath {
  progress?: ProgressStats;
}
