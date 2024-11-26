# Blog Posts Directory

This directory contains all blog posts for your portfolio website. Each blog post should be a markdown file (`.md`) with the following structure:

## File Naming
- Use kebab-case for file names (e.g., `my-first-blog-post.md`)
- The file name will be used as the URL slug

## Front Matter
Each blog post should start with front matter (metadata) in YAML format:

```yaml
---
title: "Your Blog Post Title"
date: 2024-01-01
coverImage: "/blog/images/your-image.jpg"
excerpt: "A brief description of your blog post (optional)"
tags: ["web-development", "react", "nextjs"]  # optional
---
```

## Content
After the front matter, write your blog post content using Markdown:

```markdown
# Main Title

## Subheading

Normal paragraph text goes here.

### Code Examples
```javascript
const example = "This is a code block";
console.log(example);
```

### Images
![Alt text](/blog/images/your-image.jpg)

### Lists
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

### Links
[Link text](https://example.com)
```

## Images
- Store blog images in `/public/blog/images/`
- Use relative paths in your markdown: `/blog/images/your-image.jpg`
- Optimize images before uploading
