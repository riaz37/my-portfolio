import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
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
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  }],
  resources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
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

skillSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema);
