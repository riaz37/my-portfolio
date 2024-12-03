import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  description: string;
  content: string;
  slug: string;
  tags: string[];
  author: {
    name: string;
    email: string;
    image?: string;
  };
  coverImage?: string;
  readingTime?: number;
  views: number;
  likes: number;
  isPublished: boolean;
  isDeleted?: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  author: {
    name: {
      type: String,
      required: [true, 'Author name is required'],
    },
    email: {
      type: String,
      required: [true, 'Author email is required'],
      lowercase: true,
    },
    image: String,
  },
  coverImage: String,
  readingTime: Number,
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  publishedAt: Date,
}, {
  timestamps: true,
});

// Add text index for search
blogSchema.index({ 
  title: 'text', 
  description: 'text', 
  content: 'text',
  tags: 'text' 
});

// Ensure slug is unique before saving
blogSchema.pre('save', async function(next) {
  if (this.isModified('title')) {
    const slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Check if slug exists
    const count = await mongoose.models.Blog.countDocuments({
      slug: new RegExp(`^${slug}(-\\d+)?$`),
      _id: { $ne: this._id }
    });
    
    this.slug = count ? `${slug}-${count + 1}` : slug;
  }
  next();
});

// Create or get the model
export const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;
