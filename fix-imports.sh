#!/bin/bash

# Clean and reinstall dependencies
rm -rf .next
rm -rf node_modules
npm install

# Build the project
npm run build
