import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { BaseDocument, WithSlug, WithViews, WithLikes, WithPublishStatus } from '../types';
import { withTimestamps, withPublishStatus } from '../plugins/baseSchema';

export interface IBlog extends BaseDocument, WithSlug, WithViews, WithLikes, WithPublishStatus {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  authorEmail: string;
}

const blogSchema = new Schema<IBlog>({
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  title: { 
    type: String, 
    required: true,
    index: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  excerpt: { 
    type: String, 
    required: true 
  },
  coverImage: { 
    type: String, 
    required: true 
  },
  tags: [{ 
    type: String,
    index: true 
  }],
  views: { 
    type: Number, 
    default: 0 
  },
  likes: { 
    type: Number, 
    default: 0 
  },
  authorEmail: { 
    type: String, 
    required: true,
    index: true 
  }
});

// Apply plugins
withTimestamps(blogSchema);
withPublishStatus(blogSchema);

// Add compound indexes for common queries
blogSchema.index({ published: 1, createdAt: -1 });
blogSchema.index({ tags: 1, published: 1 });
blogSchema.index({ authorEmail: 1, published: 1 });

// Virtual for URL
blogSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

export const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);
