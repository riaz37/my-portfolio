import { Schema } from 'mongoose';

// Timestamp plugin to add createdAt and updatedAt fields
export function withTimestamps(schema: Schema) {
  schema.add({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  schema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
  });
}

// Optional: Add soft delete functionality
export function withSoftDelete(schema: Schema) {
  schema.add({
    deletedAt: { type: Date, default: null }
  });

  schema.methods.softDelete = function() {
    this.deletedAt = new Date();
    return this.save();
  };

  schema.pre('find', function() {
    this.where({ deletedAt: null });
  });
}

// Optional: Add ownership tracking
export function withOwnership(schema: Schema) {
  schema.add({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  });
}

// Optional: Add publish status
export function withPublishStatus(schema: Schema) {
  schema.add({
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null }
  });
}

// Optional: Add view tracking
export function withViews(schema: Schema) {
  schema.add({
    views: { type: Number, default: 0 }
  });

  schema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
  };
}

// Optional: Add likes tracking
export function withLikes(schema: Schema) {
  schema.add({
    likes: { type: Number, default: 0 }
  });

  schema.methods.incrementLikes = function() {
    this.likes += 1;
    return this.save();
  };
}
