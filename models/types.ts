import { Document } from 'mongoose';

export interface BaseDocument extends Document {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WithTimestamps {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WithSoftDelete {
  deletedAt?: Date | null;
}

export interface WithOwnership {
  ownerId?: string;
}

export interface WithPublishStatus {
  isPublished?: boolean;
  publishedAt?: Date | null;
  unpublishedAt?: Date | null;
}
