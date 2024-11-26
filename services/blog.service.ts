import { BlogPost } from '@/models/blog/BlogPost';
import { connectToDatabase } from '@/lib/db/mongodb';
import { NotFoundError } from '@/lib/exceptions/AppError';
import { cacheService } from '@/lib/utils/cache';
import type { Document } from 'mongoose';

interface BlogFilters {
  tag?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'popular';
  published?: boolean;
}

interface PaginationOptions {
  page: number;
  limit: number;
}

interface BlogData {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  published?: boolean;
  authorEmail: string;
}

class BlogService {
  private static instance: BlogService;
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_KEYS = {
    BLOG: 'blog:',
    TAGS: 'tags',
    BLOGS_LIST: 'blogs:list:',
  };

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  private async ensureConnection() {
    await connectToDatabase();
  }

  private buildQuery(filters: BlogFilters = {}) {
    const query: any = {};

    if (typeof filters.published === 'boolean') {
      query.published = filters.published;
    }

    if (filters.tag) {
      query.tags = filters.tag;
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { content: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }

  private getSortOptions(sort: BlogFilters['sort'] = 'newest') {
    const sortOptions: Record<string, any> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      popular: { views: -1 },
    };

    return sortOptions[sort];
  }

  private getCacheKey(type: keyof typeof this.CACHE_KEYS, ...parts: string[]): string {
    return `${this.CACHE_KEYS[type]}${parts.join(':')}`;
  }

  private clearBlogCache(slug: string) {
    const cacheKeys = cacheService.getKeysByPattern(this.CACHE_KEYS.BLOG);
    cacheKeys.forEach(key => cacheService.del(key));
    cacheService.del(this.CACHE_KEYS.TAGS);
  }

  public async getBlogs(
    filters: BlogFilters = {},
    pagination: PaginationOptions
  ) {
    await this.ensureConnection();

    const cacheKey = this.getCacheKey(
      'BLOGS_LIST',
      JSON.stringify(filters),
      `${pagination.page}:${pagination.limit}`
    );

    return cacheService.getOrSet(
      cacheKey,
      async () => {
        const query = this.buildQuery(filters);
        const sort = this.getSortOptions(filters.sort);
        const skip = (pagination.page - 1) * pagination.limit;

        const [blogs, total] = await Promise.all([
          BlogPost.find(query)
            .sort(sort)
            .skip(skip)
            .limit(pagination.limit)
            .lean(),
          BlogPost.countDocuments(query),
        ]);

        return {
          blogs,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            hasMore: pagination.page * pagination.limit < total,
          },
        };
      },
      this.CACHE_TTL
    );
  }

  public async getBlogBySlug(slug: string) {
    await this.ensureConnection();

    const cacheKey = this.getCacheKey('BLOG', slug);
    
    return cacheService.getOrSet(
      cacheKey,
      async () => {
        const blog = await BlogPost.findOne({ slug }).lean();

        if (!blog) {
          throw new NotFoundError('Blog post not found');
        }

        return blog;
      },
      this.CACHE_TTL
    );
  }

  public async createBlog(data: BlogData) {
    await this.ensureConnection();

    const blog = new BlogPost(data);
    await blog.save();

    this.clearBlogCache(blog.slug);
    return blog;
  }

  public async updateBlog(slug: string, authorEmail: string, data: Partial<BlogData>) {
    await this.ensureConnection();

    const blog = await BlogPost.findOneAndUpdate(
      { slug, authorEmail },
      { $set: data },
      { new: true }
    );

    if (!blog) {
      throw new NotFoundError('Blog post not found');
    }

    this.clearBlogCache(slug);
    return blog;
  }

  public async deleteBlog(slug: string, authorEmail: string) {
    await this.ensureConnection();

    const blog = await BlogPost.findOneAndDelete({ slug, authorEmail });

    if (!blog) {
      throw new NotFoundError('Blog post not found');
    }

    this.clearBlogCache(slug);
    return blog;
  }

  public async incrementViews(slug: string) {
    await this.ensureConnection();

    const blog = await BlogPost.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      throw new NotFoundError('Blog post not found');
    }

    const cacheKey = this.getCacheKey('BLOG', slug);
    cacheService.set(cacheKey, blog, this.CACHE_TTL);

    return blog;
  }

  public async getTags() {
    await this.ensureConnection();

    return cacheService.getOrSet(
      this.CACHE_KEYS.TAGS,
      async () => {
        const tags = await BlogPost.aggregate([
          { $match: { published: true } },
          { $unwind: '$tags' },
          {
            $group: {
              _id: '$tags',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          {
            $project: {
              _id: 0,
              tag: '$_id',
              count: 1,
            },
          },
        ]);

        return tags;
      },
      this.CACHE_TTL
    );
  }
}

export const blogService = BlogService.getInstance();
