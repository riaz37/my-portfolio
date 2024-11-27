import mongoose from 'mongoose';

const playgroundSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  technologies: {
    type: [String],
    required: true,
  },
  githubUrl: {
    type: String,
  },
  demoUrl: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
}, {
  timestamps: true,
});

export const Playground = mongoose.models.Playground || mongoose.model('Playground', playgroundSchema);
