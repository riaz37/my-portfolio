import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  technologies: [{
    type: String,
    required: [true, 'At least one technology is required'],
  }],
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  githubUrl: {
    type: String,
    required: [true, 'GitHub URL is required'],
  },
  liveUrl: {
    type: String,
    default: '',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;
