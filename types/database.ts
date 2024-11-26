import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  emailVerified: Date | null;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  image?: string;
}

export interface UserProgress {
  _id?: ObjectId;
  userId: ObjectId;
  progress: {
    [key: string]: {
      completed: boolean;
      score?: number;
      lastAttempt?: Date;
    };
  };
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}
