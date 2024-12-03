import { NextResponse } from 'next/server';
import { createApiHandler } from '@/lib/api/base-handler';
import { createBlogSchema, updateBlogSchema, getBlogSchema, getBlogsSchema } from './schema';
import { createSuccessResponse } from '@/lib/api/response';
import { blogService } from '@/services/blog.service';

// GET /api/v1/blog
export const GET = createApiHandler(
  {
    method: 'GET',
    rateLimit: {
      maxRequests: 100,
      interval: 60 * 1000,
    },
  },
  async ({ searchParams, session }) => {
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const tag = searchParams.get('tag') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || 'newest';
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL;

    const validatedParams = getBlogsSchema.parse({
      page,
      limit,
      tag,
      search,
      sort,
    });

    const { blogs, pagination } = await blogService.getBlogs(
      {
        tag: validatedParams.tag,
        search: validatedParams.search,
        sort: validatedParams.sort,
        published: !isAdmin ? true : undefined, // Show all posts for admin
      },
      {
        page: validatedParams.page,
        limit: validatedParams.limit,
      }
    );

    return createSuccessResponse(blogs, pagination);
  }
);

// GET /api/v1/blog/[slug]
export const GET_BY_SLUG = createApiHandler(
  {
    method: 'GET',
    rateLimit: {
      maxRequests: 100,
      interval: 60 * 1000,
    },
  },
  async ({ params, session }) => {
    const { slug } = getBlogSchema.parse(params);
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL;
    const blog = await blogService.getBlogBySlug(slug, !isAdmin);
    
    if (!isAdmin) {
      await blogService.incrementViews(slug);
    }
    
    return createSuccessResponse(blog);
  }
);

// POST /api/v1/blog
export const POST = createApiHandler(
  {
    method: 'POST',
    schema: createBlogSchema,
    requireAuth: true,
    rateLimit: {
      maxRequests: 50,
      interval: 60 * 1000,
    },
  },
  async ({ req }) => {
    if (req.session?.user?.email !== process.env.ADMIN_EMAIL) {
      throw new Error('Unauthorized: Only admin can create blog posts');
    }

    const blog = await blogService.createBlog({
      ...req.validatedBody,
      authorEmail: req.session.user.email,
    });

    return createSuccessResponse(blog, undefined, 201);
  }
);

// PUT /api/v1/blog/[slug]
export const PUT = createApiHandler(
  {
    method: 'PUT',
    schema: updateBlogSchema,
    requireAuth: true,
    rateLimit: {
      maxRequests: 50,
      interval: 60 * 1000,
    },
  },
  async ({ req, params }) => {
    if (req.session?.user?.email !== process.env.ADMIN_EMAIL) {
      throw new Error('Unauthorized: Only admin can update blog posts');
    }

    const { slug } = getBlogSchema.parse(params);
    const blog = await blogService.updateBlog(slug, req.validatedBody);
    return createSuccessResponse(blog);
  }
);

// DELETE /api/v1/blog/[slug]
export const DELETE = createApiHandler(
  {
    method: 'DELETE',
    requireAuth: true,
    rateLimit: {
      maxRequests: 50,
      interval: 60 * 1000,
    },
  },
  async ({ req, params }) => {
    if (req.session?.user?.email !== process.env.ADMIN_EMAIL) {
      throw new Error('Unauthorized: Only admin can delete blog posts');
    }

    const { slug } = getBlogSchema.parse(params);
    await blogService.deleteBlog(slug);
    return createSuccessResponse({ deleted: true });
  }
);

// GET /api/v1/blog/tags
export const GET_TAGS = createApiHandler(
  {
    method: 'GET',
    rateLimit: {
      maxRequests: 100,
      interval: 60 * 1000,
    },
  },
  async () => {
    const tags = await blogService.getTags();
    return createSuccessResponse(tags);
  }
);
