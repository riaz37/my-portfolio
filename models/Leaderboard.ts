import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  gamesCompleted: {
    type: Number,
    default: 0,
  },
  achievementsCount: {
    type: Number,
    default: 0,
  },
  topSkill: {
    name: String,
    level: Number,
  },
  rank: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

leaderboardSchema.index({ points: -1 });

export const Leaderboard = mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema);
