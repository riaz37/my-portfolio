import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
  },
  avatarUrl: {
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

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
