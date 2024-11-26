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
  type: {
    type: String,
    enum: ['video', 'article', 'course', 'book', 'tool', 'other'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  isPaid: {
    type: Boolean,
    default: false,
  },
  thumbnail: {
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
  next();
});

export const LearningResource = mongoose.models.LearningResource || mongoose.model('LearningResource', resourceSchema);
