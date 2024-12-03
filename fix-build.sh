#!/bin/bash

# Clean the build
echo "Cleaning build files..."
rm -rf .next
rm -rf node_modules

# Install dependencies
echo "Installing dependencies..."
npm install

# Create necessary directories if they don't exist
echo "Ensuring directory structure..."
mkdir -p components/shared/ui/core
mkdir -p components/shared/ui/overlay
mkdir -p components/shared/ui/feedback
mkdir -p components/features/admin

# Build the project
echo "Building project..."
npm run build
