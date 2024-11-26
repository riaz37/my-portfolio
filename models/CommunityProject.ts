import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityProject extends Document {
  name: string;
  description: string;
  stars: string;
  forks: string;
  contributors: string;
  tags: string[];
  github: string;
  website?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  goodFirstIssues: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommunityProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stars: {
    type: String,
    required: true,
  },
  forks: {
    type: String,
    required: true,
  },
  contributors: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  github: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  goodFirstIssues: {
    type: Number,
    required: true,
    min: 0,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.CommunityProject || mongoose.model<ICommunityProject>('CommunityProject', CommunityProjectSchema);
