import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  hints: string[];
  starterCode: {
    javascript: string;
    python: string;
  };
  testCases: {
    input: any;
    output: string;
  }[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  hints: [{
    type: String,
  }],
  starterCode: {
    javascript: {
      type: String,
      default: '',
    },
    python: {
      type: String,
      default: '',
    },
  },
  testCases: [{
    input: Schema.Types.Mixed,
    output: String,
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);
