import mongoose, { Schema, Document } from 'mongoose';
import { slugify } from '@/lib/utils/string';
import { withTimestamps } from './plugins/baseSchema';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  published: boolean;
  views: number;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    published: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    authorEmail: {
      type: String,
      required: [true, 'Author email is required'],
      index: true,
    },
  }
);

// Create text index for full-text search
BlogSchema.index({
  title: 'text',
  content: 'text',
  excerpt: 'text',
  tags: 'text',
});

// Generate slug before saving
BlogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title);
  }
  next();
});

// Clean up HTML content before saving
BlogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Add any HTML sanitization here if needed
  }
  next();
});

// Apply plugins
BlogSchema.plugin(withTimestamps);

export const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
