import mongoose from 'mongoose';
import { LearningPath } from './LearningPath';

const careerPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  learningPaths: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningPath',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

careerPathSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const CareerPath = mongoose.models.CareerPath || mongoose.model('CareerPath', careerPathSchema);
