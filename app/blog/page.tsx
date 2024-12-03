'use client';

import * as React from "react";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  SearchIcon, 
  FilterIcon, 
  CalendarIcon, 
  TagIcon, 
  BookOpenIcon,
  LayoutGridIcon,
  ListIcon,
  Check,
  ChevronDown,
  PlusCircle
} from 'lucide-react';

import { Badge } from '@/components/shared/ui/core/badge';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/form/input';
import * as Select from '@/components/shared/ui/core/select';
import { Skeleton } from '@/components/shared/ui/feedback/skeleton';
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from '@/components/shared/ui/data-display/avatar';
import { cn } from '@/lib/utils';

// Blog Post Type Definition
interface BlogPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  tags: string[];
  author: {
    name: string;
    email: string;
    image?: string;
  };
  coverImage?: string;
  readingTime?: number;
  views: number;
  likes: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogResponse {
  data: {
    blogs: BlogPost[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
  success: boolean;
}

type ViewMode = 'grid' | 'list';

const BlogCard = ({ blog, viewMode }: { blog: BlogPost; viewMode: ViewMode }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/blog/${blog.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'group cursor-pointer rounded-lg border bg-card p-4 transition-all hover:shadow-md',
        viewMode === 'grid' ? 'flex flex-col gap-4' : 'flex gap-6'
      )}
      onClick={handleClick}
    >
      {blog.coverImage && (
        <div className={cn(
          'relative overflow-hidden rounded-md',
          viewMode === 'grid' ? 'aspect-[16/9] w-full' : 'aspect-[16/9] w-1/3'
        )}>
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {blog.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="line-clamp-2 text-xl font-semibold tracking-tight">
            {blog.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {blog.description}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          {blog.readingTime && (
            <div className="flex items-center gap-1">
              <BookOpenIcon className="h-4 w-4" />
              <span>{blog.readingTime} min read</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function BlogPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasNextPage: false
  });

  const createQueryString = (params: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    for (const [key, value] of Object.entries(params)) {
      if (value === null) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    }

    return current.toString();
  };

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/blogs?${searchParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch blog posts');
      }

      const { data } = await response.json();
      
      if (!data || !data.blogs) {
        throw new Error('Invalid response format');
      }

      setBlogs(data.blogs);
      setPagination({
        page: data.pagination.currentPage,
        limit: data.pagination.itemsPerPage,
        total: data.pagination.totalItems,
        hasNextPage: data.pagination.currentPage < data.pagination.totalPages
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching blogs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [searchParams]);

  const handleSearch = (value: string) => {
    router.push(
      `/blog?${createQueryString({
        search: value || null,
        page: '1',
      })}`,
      { scroll: false }
    );
  };

  const handleSort = (value: string) => {
    router.push(
      `/blog?${createQueryString({
        sort: value,
        page: '1',
      })}`,
      { scroll: false }
    );
  };

  const handlePageChange = (page: number) => {
    router.push(
      `/blog?${createQueryString({
        page: page.toString(),
      })}`,
      { scroll: false }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => fetchBlogs()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground">
          Explore my thoughts on software development, technology, and more.
        </p>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="mb-8 flex gap-4">
          <Link href="/admin/blogs">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
          <Link href="/admin/blogs">
            <Button variant="outline">
              Manage Posts
            </Button>
          </Link>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-10"
              onChange={(e) => handleSearch(e.target.value)}
              defaultValue={searchParams.get('search') || ''}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Select.Select
            defaultValue={searchParams.get('sort') || 'newest'}
            onValueChange={handleSort}
          >
            <Select.SelectTrigger className="w-[180px]">
              <Select.SelectValue placeholder="Sort by" />
            </Select.SelectTrigger>
            <Select.SelectContent>
              <Select.SelectItem value="newest">Newest First</Select.SelectItem>
              <Select.SelectItem value="oldest">Oldest First</Select.SelectItem>
              <Select.SelectItem value="popular">Most Popular</Select.SelectItem>
            </Select.SelectContent>
          </Select.Select>
          <div className="flex rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'rounded-none',
                viewMode === 'grid' && 'bg-secondary'
              )}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'rounded-none',
                viewMode === 'list' && 'bg-secondary'
              )}
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts found.</p>
        </div>
      ) : (
        <div className={cn(
          'grid gap-6',
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
        )}>
          <AnimatePresence>
            {blogs.map((post) => (
              <BlogCard key={post._id} blog={post} viewMode={viewMode} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }).map((_, i) => (
              <Button
                key={i}
                variant={pagination.page === i + 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
