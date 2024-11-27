import mongoose from 'mongoose';

const codeSnippetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
codeSnippetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const CodeSnippet = mongoose.models.CodeSnippet || mongoose.model('CodeSnippet', codeSnippetSchema);
