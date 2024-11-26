import { Schema } from 'mongoose';
import { WithTimestamps, WithSoftDelete, WithOwnership, WithPublishStatus } from '../types';

export function withTimestamps<T extends WithTimestamps>(schema: Schema<T>) {
  schema.add({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  schema.pre('save', function(next) {
    if (this.isModified()) {
      this.updatedAt = new Date();
    }
    next();
  });
}

export function withSoftDelete<T extends WithSoftDelete>(schema: Schema<T>) {
  schema.add({
    deletedAt: { type: Date, default: null }
  });

  schema.pre('find', function() {
    this.where({ deletedAt: null });
  });

  schema.pre('findOne', function() {
    this.where({ deletedAt: null });
  });
}

export function withOwnership<T extends WithOwnership>(schema: Schema<T>) {
  schema.add({
    createdBy: { type: String, required: true, index: true },
    updatedBy: { type: String }
  });
}

export function withPublishStatus<T extends WithPublishStatus>(schema: Schema<T>) {
  schema.add({
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date }
  });

  schema.pre('save', function(next) {
    if (this.isModified('published') && this.published && !this.publishedAt) {
      this.publishedAt = new Date();
    }
    next();
  });
}
