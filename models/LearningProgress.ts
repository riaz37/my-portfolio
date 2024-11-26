import mongoose from 'mongoose';

const learningProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  learningPathId: {
    type: String,
    required: true,
  },
  completedResources: [{
    resourceId: String,
    skillId: String,
    completedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Create a compound index for efficient queries
learningProgressSchema.index({ userId: 1, learningPathId: 1 });

// Add a method to calculate progress statistics
learningProgressSchema.methods.getStats = function() {
  const totalResources = this.completedResources.length;
  const completedResources = this.completedResources.filter(r => r.completedAt).length;
  
  return {
    completed: completedResources,
    total: totalResources,
    percentage: totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0,
  };
};

// Add a method to mark a resource as complete
learningProgressSchema.methods.markResourceComplete = function(resourceId: string, skillId: string) {
  const existingResource = this.completedResources.find(
    r => r.resourceId === resourceId && r.skillId === skillId
  );

  if (!existingResource) {
    this.completedResources.push({ resourceId, skillId, completedAt: new Date() });
  }

  this.lastAccessed = new Date();
  return this.save();
};

// Add a method to mark a resource as incomplete
learningProgressSchema.methods.markResourceIncomplete = function(resourceId: string, skillId: string) {
  this.completedResources = this.completedResources.filter(
    r => !(r.resourceId === resourceId && r.skillId === skillId)
  );

  this.lastAccessed = new Date();
  return this.save();
};

export const LearningProgress = mongoose.models.LearningProgress || 
  mongoose.model('LearningProgress', learningProgressSchema);
