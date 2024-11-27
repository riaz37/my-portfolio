import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['submitted', 'running', 'passed', 'failed'],
    default: 'submitted',
  },
  executionTime: Number,
  memory: Number,
  error: String,
  testResults: [{
    passed: Boolean,
    input: mongoose.Schema.Types.Mixed,
    expectedOutput: mongoose.Schema.Types.Mixed,
    actualOutput: mongoose.Schema.Types.Mixed,
    error: String,
  }],
}, {
  timestamps: true,
});

solutionSchema.index({ userId: 1, gameId: 1 });

export const Solution = mongoose.models.Solution || mongoose.model('Solution', solutionSchema);
