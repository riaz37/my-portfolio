import mongoose from 'mongoose';
import { baseSchema } from './baseSchema';

const communityProjectSchema = new mongoose.Schema({
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
    default: '0',
  },
  forks: {
    type: String,
    default: '0',
  },
  contributors: {
    type: String,
    default: '0',
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
    default: 0,
  },
}).add(baseSchema);

export const CommunityProject = mongoose.models.CommunityProject || mongoose.model('CommunityProject', communityProjectSchema);
