import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().min(1, 'Excerpt is required').max(300),
  coverImage: z.string().url('Invalid cover image URL'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  published: z.boolean().default(false),
});

export const updateBlogSchema = createBlogSchema.partial();

export const getBlogSchema = z.object({
  slug: z.string(),
});

export const getBlogsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  tag: z.string().nullish(),
  search: z.string().nullish(),
  sort: z.enum(['newest', 'oldest', 'popular']).default('newest'),
});
