import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { BaseDocument } from '../types';
import { withTimestamps } from '../plugins/baseSchema';

export interface IUserChallenge extends BaseDocument {
  userId: string;
  challengeId: string;
  completed: boolean;
  completedAt?: Date;
  attempts: number;
  progress: number;
  lastAttemptAt?: Date;
  timeSpent: number;  // in seconds
  score?: number;
  feedback?: string;
  hints: {
    used: string[];
    remainingHints: number;
  };
  code: {
    current: string;
    history: {
      code: string;
      timestamp: Date;
    }[];
  };
}

const userChallengeSchema = new Schema<IUserChallenge>({
  userId: {
    type: String,
    required: true,
    index: true,
    ref: 'User'
  },
  challengeId: {
    type: String,
    required: true,
    index: true,
    ref: 'Challenge'
  },
  completed: {
    type: Boolean,
    default: false,
    index: true
  },
  completedAt: {
    type: Date
  },
  attempts: {
    type: Number,
    default: 0,
    min: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
    index: true
  },
  lastAttemptAt: {
    type: Date
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: String,
  hints: {
    used: {
      type: [String],
      default: []
    },
    remainingHints: {
      type: Number,
      default: 3,
      min: 0
    }
  },
  code: {
    current: {
      type: String,
      required: true
    },
    history: [{
      code: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  }
});

// Apply plugins
withTimestamps(userChallengeSchema);

// Add compound indexes
userChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
userChallengeSchema.index({ userId: 1, completed: 1 });
userChallengeSchema.index({ userId: 1, progress: 1 });
userChallengeSchema.index({ challengeId: 1, completed: 1 });

// Methods
userChallengeSchema.methods.recordAttempt = async function(code: string): Promise<void> {
  this.attempts += 1;
  this.lastAttemptAt = new Date();
  this.code.current = code;
  this.code.history.push({
    code,
    timestamp: new Date()
  });
  await this.save();
};

userChallengeSchema.methods.useHint = async function(hintId: string): Promise<boolean> {
  if (this.hints.remainingHints <= 0 || this.hints.used.includes(hintId)) {
    return false;
  }
  
  this.hints.used.push(hintId);
  this.hints.remainingHints -= 1;
  await this.save();
  return true;
};

userChallengeSchema.methods.complete = async function(
  finalCode: string,
  score: number
): Promise<void> {
  this.completed = true;
  this.completedAt = new Date();
  this.progress = 100;
  this.code.current = finalCode;
  this.code.history.push({
    code: finalCode,
    timestamp: new Date()
  });
  this.score = score;
  await this.save();
  
  // Update user progress
  const UserProgress = mongoose.model('UserProgress');
  await UserProgress.findOneAndUpdate(
    { userId: this.userId },
    { 
      $inc: { 
        [`progress.${this.challengeId}`]: score,
        experience: score
      }
    },
    { upsert: true }
  );
};

// Statics
userChallengeSchema.statics.findIncomplete = async function(
  userId: string
): Promise<IUserChallenge[]> {
  return this.find({
    userId,
    completed: false
  }).sort('progress');
};

userChallengeSchema.statics.findRecentlyCompleted = async function(
  limit: number = 10
): Promise<IUserChallenge[]> {
  return this.find({
    completed: true
  })
    .sort('-completedAt')
    .limit(limit)
    .populate('challengeId', 'title difficulty');
};

export const UserChallenge = mongoose.models.UserChallenge || 
  mongoose.model<IUserChallenge>('UserChallenge', userChallengeSchema);
