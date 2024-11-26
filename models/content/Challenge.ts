import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { BaseDocument, WithSlug, WithViews, WithLikes, WithPublishStatus } from '../types';
import { withTimestamps, withPublishStatus, withViews, withLikes } from '../plugins/baseSchema';

interface IStep {
  title: string;
  content: string;
  order: number;
}

export interface IChallenge extends BaseDocument {
  title: string;
  slug: string;
  category: string;
  language: 'javascript' | 'python' | 'typescript';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  steps: IStep[];
  hints: string[];
  code: string;
  solution: string;
  testCases: string[];
  points: number;
  timeLimit: number;  // in minutes
  prerequisites: string[];
  tags: string[];
}

const stepSchema = new Schema<IStep>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
    min: 0
  }
});

const challengeSchema = new Schema<IChallenge>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'typescript'],
    index: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    index: true
  },
  description: {
    type: String,
    required: true,
  },
  steps: {
    type: [stepSchema],
    required: true,
    validate: [
      {
        validator: function(steps: IStep[]) {
          // Ensure steps are in order
          return steps.every((step, index) => step.order === index);
        },
        message: 'Steps must be in sequential order'
      }
    ]
  },
  hints: {
    type: [String],
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
  testCases: {
    type: [String],
    required: true,
  },
  points: {
    type: Number,
    required: true,
    min: 0,
    default: 100
  },
  timeLimit: {
    type: Number,
    required: true,
    min: 1,
    default: 30
  },
  prerequisites: {
    type: [String],
    default: [],
    index: true
  },
  tags: {
    type: [String],
    default: [],
    index: true
  }
});

// Apply plugins
withTimestamps(challengeSchema);
withPublishStatus(challengeSchema);
withViews(challengeSchema);
withLikes(challengeSchema);

// Add compound indexes for common queries
challengeSchema.index({ difficulty: 1, language: 1 });
challengeSchema.index({ category: 1, difficulty: 1 });
challengeSchema.index({ tags: 1, difficulty: 1 });
challengeSchema.index({ points: -1, difficulty: 1 });

// Methods
challengeSchema.methods.isPrerequisiteSatisfied = async function(
  userId: string,
  UserProgress: any
): Promise<boolean> {
  if (!this.prerequisites.length) return true;
  
  const progress = await UserProgress.findOne({ userId });
  if (!progress) return false;
  
  return this.prerequisites.every(prereq => 
    progress.progress[prereq] && progress.progress[prereq] >= 100
  );
};

// Virtuals
challengeSchema.virtual('estimatedTime').get(function() {
  return this.timeLimit * (
    this.difficulty === 'Advanced' ? 1.5 :
    this.difficulty === 'Intermediate' ? 1.0 :
    0.75
  );
});

// Pre-save middleware
challengeSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.isModified('slug')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export const Challenge = mongoose.models.Challenge || 
  mongoose.model<IChallenge>('Challenge', challengeSchema);
