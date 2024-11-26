import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { BaseDocument, WithSlug, WithViews, WithLikes, WithPublishStatus } from '../types';
import { withTimestamps, withPublishStatus, withViews, withLikes } from '../plugins/baseSchema';

export interface IResource extends BaseDocument {
  title: string;
  slug: string;
  description: string;
  category: string;
  imageUrl: string;
  resourceType: 'link' | 'document' | 'video' | 'tutorial' | 'course';
  link?: string;
  resourceUrl?: string;
  createdBy: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: number;  // in minutes
  prerequisites?: string[];
  relatedResources?: string[];
  metadata: {
    author?: string;
    publisher?: string;
    publishedDate?: Date;
    language?: string;
    fileSize?: number;  // in bytes
    fileType?: string;
  };
}

const resourceSchema = new Schema<IResource>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: true,
  },
  resourceType: {
    type: String,
    enum: ['link', 'document', 'video', 'tutorial', 'course'],
    required: true,
    index: true
  },
  link: {
    type: String,
    required: function(this: any) {
      return this.resourceType === 'link';
    },
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Link must be a valid URL'
    }
  },
  resourceUrl: {
    type: String,
    required: function(this: any) {
      return ['document', 'video', 'tutorial', 'course'].includes(this.resourceType);
    },
  },
  createdBy: {
    type: String,
    required: true,
    ref: 'User',
    index: true
  },
  tags: {
    type: [String],
    default: [],
    index: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
    index: true
  },
  duration: {
    type: Number,
    min: 0
  },
  prerequisites: [{
    type: String,
    ref: 'Resource'
  }],
  relatedResources: [{
    type: String,
    ref: 'Resource'
  }],
  metadata: {
    author: String,
    publisher: String,
    publishedDate: Date,
    language: String,
    fileSize: Number,
    fileType: String
  }
});

// Apply plugins
withTimestamps(resourceSchema);
withPublishStatus(resourceSchema);
withViews(resourceSchema);
withLikes(resourceSchema);

// Add compound indexes
resourceSchema.index({ category: 1, resourceType: 1 });
resourceSchema.index({ tags: 1, difficulty: 1 });
resourceSchema.index({ 'metadata.language': 1, difficulty: 1 });

// Methods
resourceSchema.methods.isAccessible = async function(userId: string): Promise<boolean> {
  if (!this.prerequisites || this.prerequisites.length === 0) return true;
  
  const UserProgress = mongoose.model('UserProgress');
  const progress = await UserProgress.findOne({ userId });
  if (!progress) return false;
  
  return this.prerequisites.every(prereq => 
    progress.progress[prereq] && progress.progress[prereq] >= 100
  );
};

resourceSchema.methods.addRelatedResource = async function(resourceId: string): Promise<void> {
  if (!this.relatedResources.includes(resourceId)) {
    this.relatedResources.push(resourceId);
    await this.save();
  }
};

// Pre-save middleware
resourceSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.isModified('slug')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Statics
resourceSchema.statics.findByType = async function(
  type: IResource['resourceType'],
  options: { 
    difficulty?: IResource['difficulty'],
    category?: string,
    tags?: string[]
  } = {}
): Promise<IResource[]> {
  const query: any = { resourceType: type };
  
  if (options.difficulty) query.difficulty = options.difficulty;
  if (options.category) query.category = options.category;
  if (options.tags?.length) query.tags = { $all: options.tags };
  
  return this.find(query).sort('-createdAt');
};

export const Resource = mongoose.models.Resource || 
  mongoose.model<IResource>('Resource', resourceSchema);
