export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type ResourceType = 'video' | 'article' | 'documentation' | 'course' | 'practice';

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
  level: SkillLevel;
  duration?: string; // e.g., "2 hours", "15 minutes"
  tags: string[];
  provider?: string; // e.g., "Udemy", "freeCodeCamp", "MDN"
  // Code practice specific fields
  starterCode?: string;
  instructions?: string;
  testCases?: TestCase[];
  language?: string;
  solutionCode?: string;
  completed?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon component name
  level: SkillLevel;
  prerequisites?: string[]; // IDs of prerequisite skills
  resources: Resource[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  skills: Skill[];
  estimatedTime: string; // e.g., "3 months"
  difficulty: SkillLevel;
  progress?: {
    learningPathId: string;
    userId: string;
    completedResources: {
      resourceId: string;
      skillId: string;
      completedAt: Date;
    }[];
    lastAccessedResource?: {
      resourceId: string;
      skillId: string;
      title: string;
    };
    lastAccessedAt?: Date;
  };
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  learningPaths: LearningPath[];
}

export interface UserProgress {
  userId: string;
  resourceId: string;
  skillId: string;
  learningPathId: string;
  completed: boolean;
  lastAccessed: Date;
  completedAt?: Date;
}

export interface ProgressStats {
  totalResources: number;
  completedResources: number;
  currentSkill: string;
  lastAccessedResource: string;
  percentageComplete: number;
}

export interface LearningPathWithProgress extends LearningPath {
  progress?: ProgressStats;
}
