import mongoose from 'mongoose';
import { withTimestamps, withSoftDelete, withOwnership, withPublishStatus } from '../../../models/plugins/baseSchema';

const challengeSchema = new mongoose.Schema({
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
      required: true,
    },
    python: {
      type: String,
      required: true,
    },
  },
  solutionCode: {
    javascript: {
      type: String,
      required: true,
    },
    python: {
      type: String,
      required: true,
    },
  },
  testCases: [{
    input: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
  }],
}).add(withTimestamps).add(withSoftDelete).add(withOwnership).add(withPublishStatus);

export const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);
