import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'article', 'documentation', 'course', 'practice'],
    required: true,
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  duration: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  provider: {
    type: String,
  },
  // Code practice specific fields
  starterCode: {
    type: String,
  },
  instructions: {
    type: String,
  },
  language: {
    type: String,
  },
  solutionCode: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

resourceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (!this.tags) {
    this.tags = [];
  }
  next();
});

export const Resource = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
