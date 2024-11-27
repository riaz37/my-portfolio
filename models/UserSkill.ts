import mongoose from 'mongoose';

const userSkillSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  skills: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const UserSkill = mongoose.models.UserSkill || mongoose.model('UserSkill', userSkillSchema);
