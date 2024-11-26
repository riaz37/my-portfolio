import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  password?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  _id: ObjectId;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  imageUrl: string;
  gameUrl: string;
  instructions: string[];
  controls: {
    key: string;
    action: string;
  }[];
  features: string[];
  xp: number; // Experience points for completing the game
  skills: string[]; // Skills that can be learned/improved
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  _id: ObjectId;
  userId: ObjectId;
  gameId: ObjectId;
  status: 'started' | 'completed' | 'mastered';
  score: number;
  timeSpent: number; // in seconds
  attempts: number;
  completedAt?: Date;
  xpEarned: number;
  skillsGained: {
    skillName: string;
    level: number; // 1-100
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSkill {
  _id: ObjectId;
  userId: ObjectId;
  skillName: string;
  level: number; // 1-100
  xp: number;
  gamesCompleted: ObjectId[]; // References to completed games
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAchievement {
  _id: ObjectId;
  userId: ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  unlockedAt: Date;
  category: string;
  requirements: {
    type: 'games_completed' | 'skill_level' | 'xp_earned';
    value: number;
    skillName?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
