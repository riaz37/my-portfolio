'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  SearchIcon, 
  FilterIcon, 
  CalendarIcon, 
  TagIcon, 
  BookOpenIcon,
  LayoutGridIcon,
  ListIcon
} from 'lucide-react';

import { Badge } from '@/components/shared/ui/core/badge';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/shared/ui/core/select';
import { Skeleton } from '@/components/shared/ui/feedback/skeleton';
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
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

type ViewMode = 'grid' | 'list';

export default function BlogPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blogs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter and sort posts
  useEffect(() => {
    let result = [...posts];

    // Search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by tag
    if (selectedTag !== 'all') {
      result = result.filter(post => 
        post.tags.includes(selectedTag)
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredPosts(result);
  }, [searchTerm, selectedTag, sortBy, posts]);

  // Get unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  const BlogPostCard = ({ post }: { post: BlogPost }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group bg-card border border-border overflow-hidden hover:border-primary/50 transition-colors",
        viewMode === 'grid' ? 'rounded-lg' : 'rounded-md'
      )}
    >
      <div className={cn(
        "flex",
        viewMode === 'grid' ? 'flex-col' : 'flex-row items-center'
      )}>
        {/* Cover Image */}
        {post.coverImage && (
          <div className={cn(
            "relative overflow-hidden",
            viewMode === 'grid' ? 'h-40 sm:h-48 w-full' : 'h-32 w-32 flex-shrink-0'
          )}>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className={cn(
          "flex flex-col",
          viewMode === 'grid' ? 'p-4 sm:p-6' : 'p-4 flex-grow'
        )}>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h2 className={cn(
            "font-semibold group-hover:text-primary transition-colors line-clamp-2",
            viewMode === 'grid' ? 'text-lg sm:text-xl mb-2' : 'text-base sm:text-lg mb-1.5'
          )}>
            {post.title}
          </h2>

          {/* Description */}
          <p className={cn(
            "text-muted-foreground line-clamp-2 mb-4",
            viewMode === 'grid' ? 'text-sm sm:text-base' : 'text-sm'
          )}>
            {post.description}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground mt-auto">
            <div className="flex items-center">
              <CalendarIcon className="h-3 w-3 mr-1" />
              <span>
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <BookOpenIcon className="h-3 w-3 mr-1" />
              <span>{post.readingTime || '5'} min read</span>
            </div>
            <div className="flex items-center">
              <TagIcon className="h-3 w-3 mr-1" />
              <span>{post.tags.length} tags</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 md:mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-foreground">
          Tech Insights & Coding Chronicles
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto px-4">
          Dive deep into technology, programming insights, and innovative solutions.
        </p>
      </motion.div>

      {/* Filters, Search, and View Toggle */}
      <div className="mb-6 md:mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Input 
              type="text" 
              placeholder="Search blogs by title or tag" 
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Tag">
                  {selectedTag === 'all' ? 'All Tags' : selectedTag}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(val: 'newest' | 'oldest') => setSortBy(val)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort By">
                  {sortBy === 'newest' ? 'Newest First' : 'Oldest First'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end">
          <div className="bg-card border border-border rounded-lg p-1 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-2 py-1",
                viewMode === 'grid' && "bg-primary/10 text-primary"
              )}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-2 py-1",
                viewMode === 'list' && "bg-primary/10 text-primary"
              )}
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className={cn(
        viewMode === 'grid' 
          ? 'grid gap-6 grid-cols-1 md:grid-cols-2' 
          : 'flex flex-col gap-4'
      )}>
        {isLoading ? (
          // Skeleton Loader
          <div className={cn(
            viewMode === 'grid' 
              ? 'grid gap-6 grid-cols-1 md:grid-cols-2' 
              : 'flex flex-col gap-4'
          )}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton 
                key={index} 
                className={cn(
                  viewMode === 'grid' 
                    ? 'h-[400px]' 
                    : 'h-[200px]'
                )} 
              />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground py-12 col-span-full"
          >
            No blog posts found
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post._id} className="block">
                <BlogPostCard post={post} />
              </Link>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
