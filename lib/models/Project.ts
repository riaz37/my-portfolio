import mongoose from 'mongoose';

// Check if the model already exists before defining
if (!mongoose.models.Project) {
  const projectSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    technologies: [{
      type: String,
      required: [true, 'At least one technology is required'],
      trim: true,
    }],
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    githubUrl: {
      type: String,
      required: [true, 'GitHub URL is required'],
      trim: true,
    },
    liveUrl: {
      type: String,
      default: '',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }, {
    timestamps: true,
    strict: true,
  });

  mongoose.model('Project', projectSchema);
}

// Always export the model
export default mongoose.models.Project || mongoose.model('Project');
