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
  async ({ searchParams }) => {
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';

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
        published: true,
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
  async ({ params }) => {
    const { slug } = getBlogSchema.parse(params);
    const blog = await blogService.getBlogBySlug(slug);
    await blogService.incrementViews(slug);
    return createSuccessResponse(blog);
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
    const blog = await blogService.createBlog({
      ...req.validatedBody,
      authorEmail: req.session?.user?.email,
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
    const blog = await blogService.updateBlog(
      params.slug,
      req.session?.user?.email,
      req.validatedBody
    );

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
    await blogService.deleteBlog(params.slug, req.session?.user?.email);
    return createSuccessResponse({ message: 'Blog post deleted successfully' });
  }
);
