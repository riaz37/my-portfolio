#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { promisify } = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = promisify(rl.question).bind(rl);

async function createBlogPost() {
  try {
    // Get post details
    const title = await question('Enter blog post title: ');
    const tags = await question('Enter tags (comma-separated): ');
    const excerpt = await question('Enter brief excerpt: ');
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Get current date
    const date = new Date().toISOString().split('T')[0];
    
    // Create blog post content
    const content = `---
title: "${title}"
date: ${date}
coverImage: "/blog/images/${slug}-cover.jpg"
excerpt: "${excerpt}"
tags: [${tags.split(',').map(tag => `"${tag.trim()}"`).join(', ')}]
---

# ${title}

Write your blog post content here...
`;

    // Create blog post file
    const filePath = path.join(process.cwd(), 'data', 'blog', `${slug}.md`);
    fs.writeFileSync(filePath, content);

    console.log('\nBlog post created successfully!');
    console.log(`File: ${filePath}`);
    console.log('\nNext steps:');
    console.log(`1. Add a cover image to: /public/blog/images/${slug}-cover.jpg`);
    console.log(`2. Edit the blog post content in: ${filePath}`);
    
  } catch (error) {
    console.error('Error creating blog post:', error);
  } finally {
    rl.close();
  }
}

createBlogPost();
