'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/shared/ui/core/input';
import { Button } from '@/components/shared/ui/core/button';
import { Search, Tag, ArrowRight, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '@/components/shared/ui/core/badge';
import { Skeleton } from '@/components/shared/ui/feedback/skeleton';
import { blogService } from '@/services/blog.service';
import { cn } from '@/lib/utils';
import { AnimatedBackground } from '@/components/shared/ui/effects/animated-background';

const ITEMS_PER_PAGE = 9;

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { ref, inView } = useInView();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogService.getBlogs(
          {
            search: searchQuery,
            tag: selectedTag || undefined,
            sort: 'newest',
            published: true,
          },
          {
            page,
            limit: ITEMS_PER_PAGE,
          }
        );
        
        if (page === 1) {
          setBlogs(response.blogs);
        } else {
          setBlogs(prev => [...prev, ...response.blogs]);
        }
        
        setHasMore(response.pagination.hasMore);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [page, searchQuery, selectedTag]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore, isLoading]);

  const allTags = Array.from(new Set(blogs.flatMap((blog) => blog.tags)));
  const featuredPost = blogs[0];

  return (
    <div className="min-h-screen" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <AnimatedBackground />
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{ y, opacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
        </motion.div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-4">
              <TrendingUp className="w-3 h-3 mr-1" />
              Latest Articles
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary animate-gradient-x">
              My Blog
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Exploring the intersection of design, development, and innovation through in-depth articles and tutorials.
            </p>

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 h-12 text-lg"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Button
                variant={selectedTag ? "secondary" : "outline"}
                onClick={() => {
                  setSelectedTag(null);
                  setPage(1);
                }}
                className="whitespace-nowrap h-12 text-lg"
              >
                <Tag className="mr-2 h-5 w-5" />
                All Tags
              </Button>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-2 justify-center mt-6"
              >
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "secondary"}
                    className="cursor-pointer text-sm py-1.5 px-3"
                    onClick={() => {
                      setSelectedTag(tag === selectedTag ? null : tag);
                      setPage(1);
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground" />
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && !searchQuery && !selectedTag && (
        <section className="py-20 bg-gradient-to-b from-background to-background/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl bg-card"
            >
              <Link href={`/blog/${featuredPost.slug}`}>
                <div className="grid md:grid-cols-2 gap-8 p-8">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <Badge variant="secondary" className="w-fit mb-4">Featured Post</Badge>
                    <h2 className="text-3xl font-bold mb-4 line-clamp-2">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src={featuredPost.author.avatar}
                            alt={featuredPost.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm">{featuredPost.author.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readingTime || '5 min read'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className="group">
                  <div className="bg-card rounded-xl overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-4">
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              blogs.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-card rounded-xl overflow-hidden border border-border/50 hover:border-border transition-colors duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <div className="relative h-6 w-6 rounded-full overflow-hidden">
                              <Image
                                src={post.author.avatar}
                                alt={post.author.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span>{post.author.name}</span>
                          </div>
                          <span>{formatDate(post.publishedAt || '')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          {/* Load More */}
          {(hasMore) && (
            <div
              ref={ref}
              className="flex justify-center mt-12"
            >
              <Button
                variant="outline"
                size="lg"
                disabled={isLoading}
                className="min-w-[200px]"
              >
                {isLoading ? 'Loading more...' : 'Load more articles'}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
