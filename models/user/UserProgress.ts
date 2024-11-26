import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { BaseDocument } from '../types';
import { withTimestamps } from '../plugins/baseSchema';

export interface IUserProgress extends BaseDocument {
  userId: string;
  progress: {
    [key: string]: number;
  };
  achievements: string[];
  level: number;
  experience: number;
}

const userProgressSchema = new Schema<IUserProgress>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    ref: 'User'  // Reference to User model
  },
  progress: {
    type: Schema.Types.Mixed,
    default: {},
  },
  achievements: {
    type: [String],
    default: [],
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
  },
  experience: {
    type: Number,
    default: 0,
    min: 0,
  }
});

// Apply plugins
withTimestamps(userProgressSchema);

// Add compound indexes
userProgressSchema.index({ userId: 1, level: -1 });
userProgressSchema.index({ userId: 1, experience: -1 });

// Methods
userProgressSchema.methods.addExperience = function(amount: number): void {
  this.experience += amount;
  // Level up logic (example: level = floor(sqrt(experience/100)) + 1)
  this.level = Math.floor(Math.sqrt(this.experience / 100)) + 1;
};

userProgressSchema.methods.updateProgress = function(key: string, value: number): void {
  if (!this.progress) {
    this.progress = {};
  }
  this.progress[key] = value;
};

userProgressSchema.methods.addAchievement = function(achievement: string): void {
  if (!this.achievements.includes(achievement)) {
    this.achievements.push(achievement);
  }
};

// Virtuals
userProgressSchema.virtual('nextLevelExperience').get(function() {
  const nextLevel = this.level + 1;
  return Math.pow(nextLevel - 1, 2) * 100;
});

userProgressSchema.virtual('experienceToNextLevel').get(function() {
  return this.nextLevelExperience - this.experience;
});

export const UserProgress = mongoose.models.UserProgress || 
  mongoose.model<IUserProgress>('UserProgress', userProgressSchema);
