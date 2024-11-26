import { Document } from 'mongoose';

export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface WithTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface WithSoftDelete {
  deletedAt?: Date | null;
}

export interface WithOwnership {
  createdBy: string;
  updatedBy?: string;
}
