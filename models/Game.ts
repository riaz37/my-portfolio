import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
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
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  imageUrl: String,
  instructions: [String],
  hints: [String],
  solution: {
    type: String,
    required: true,
  },
  testCases: [{
    input: mongoose.Schema.Types.Mixed,
    expectedOutput: mongoose.Schema.Types.Mixed,
    description: String,
  }],
}, {
  timestamps: true,
});

export const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);
