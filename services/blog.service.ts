import { Blog } from '@/models/Blog';
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
  description: string;
  coverImage?: string;
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
    const query: any = { isDeleted: false };

    if (typeof filters.published === 'boolean') {
      query.isPublished = filters.published;
    }

    if (filters.tag) {
      query.tags = filters.tag;
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { content: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { tags: { $regex: filters.search, $options: 'i' } },
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
      pagination.page.toString(),
      pagination.limit.toString()
    );

    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const query = this.buildQuery(filters);
    const skip = (pagination.page - 1) * pagination.limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort(this.getSortOptions(filters.sort))
        .skip(skip)
        .limit(pagination.limit)
        .populate('author', 'name email image')
        .lean(),
      Blog.countDocuments(query),
    ]);

    const result = {
      blogs,
      pagination: {
        currentPage: pagination.page,
        totalPages: Math.ceil(total / pagination.limit),
        totalItems: total,
        itemsPerPage: pagination.limit,
      },
    };

    await cacheService.set(cacheKey, JSON.stringify(result), this.CACHE_TTL);
    return result;
  }

  public async getBlogBySlug(slug: string, enforcePublished = true) {
    await this.ensureConnection();

    const cacheKey = this.getCacheKey('BLOG', slug);
    const cachedBlog = await cacheService.get(cacheKey);
    if (cachedBlog) {
      return JSON.parse(cachedBlog);
    }

    const query: any = { slug };
    if (enforcePublished) {
      query.isPublished = true;
    }

    const blog = await Blog.findOne(query)
      .populate('author', 'name email image')
      .lean();

    if (!blog) {
      throw new NotFoundError('Blog post not found');
    }

    await cacheService.set(cacheKey, JSON.stringify(blog), this.CACHE_TTL);
    return blog;
  }

  public async getBlogBySlugFromApi(slug: string) {
    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch blog post');
      }

      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getBlogBySlugFromApi:', error);
      throw error;
    }
  }

  public async createBlog(data: BlogData) {
    await this.ensureConnection();

    const blog = await Blog.create({
      ...data,
      slug: this.generateSlug(data.title),
      views: 0,
      likes: 0,
    });

    return blog.toObject();
  }

  public async updateBlog(slug: string, data: Partial<BlogData>) {
    await this.ensureConnection();

    const blog = await Blog.findOneAndUpdate(
      { slug },
      { ...data },
      { new: true }
    ).populate('author', 'name email image');

    if (!blog) {
      throw new NotFoundError('Blog post not found');
    }

    this.clearBlogCache(slug);
    return blog.toObject();
  }

  public async deleteBlog(slug: string) {
    await this.ensureConnection();

    const blog = await Blog.findOneAndUpdate(
      { slug },
      { isDeleted: true },
      { new: true }
    );

    if (!blog) {
      throw new NotFoundError('Blog post not found');
    }

    this.clearBlogCache(slug);
    return true;
  }

  public generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  public async incrementViews(slug: string) {
    await this.ensureConnection();
    await Blog.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
    this.clearBlogCache(slug);
  }

  public async getTags() {
    await this.ensureConnection();
    const tags = await Blog.distinct('tags', { isPublished: true });
    return tags;
  }
}

export const blogService = BlogService.getInstance();
