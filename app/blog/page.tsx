'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, format } from 'date-fns';
import { Search, Clock, Tag, ArrowRight, BookOpen, ThumbsUp, Eye, PenTool, Calendar } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  published: boolean;
  views: number;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
}

const MotionCard = motion(Card);

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'latest' | 'popular'>('latest');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog?getTags=true');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data.data.posts.filter((post: BlogPost) => post.published));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-card/30 backdrop-blur-sm border-primary/5">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto relative">
      {/* Animated Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_500px_at_50%_200px,rgba(var(--primary-rgb),0.1),transparent)]" />
      </div>

      <main className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative py-20 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="relative">
              <PenTool className="h-5 w-5 text-primary animate-pulse" />
              <div className="absolute inset-0 animate-ping-slow">
                <PenTool className="h-5 w-5 text-primary opacity-50" />
              </div>
            </div>

            <h2 className="text-sm font-medium text-muted-foreground">
              Insights & Tutorials
            </h2>
          </motion.div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl pb-1 relative z-10">
                <span className="inline-block animate-gradient-x bg-gradient-to-r from-violet-500 via-primary to-violet-500 bg-[length:200%_auto] bg-clip-text text-transparent">
                  My
                </span>
                <span className="inline-block animate-gradient-x bg-gradient-to-r from-blue-500 via-primary to-blue-500 bg-[length:200%_auto] bg-clip-text text-transparent">
                  Blog
                </span>
              </h1>
              <div className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-violet-500/20 via-primary/20 to-blue-500/20 blur-2xl opacity-50 animate-pulse" />
            </motion.div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12 space-y-6"
        >
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 blur-xl" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 bg-background/50 backdrop-blur-md border-primary/20 focus:border-primary/50 transition-all duration-300"
              />
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mb-6">
            <Button
              variant={activeFilter === 'latest' ? "default" : "outline"}
              onClick={() => setActiveFilter('latest')}
              className="min-w-[100px]"
            >
              Latest
            </Button>
            <Button
              variant={activeFilter === 'popular' ? "default" : "outline"}
              onClick={() => setActiveFilter('popular')}
              className="min-w-[100px]"
            >
              Popular
            </Button>
          </div>

          <ScrollArea className="w-full pb-4">
            <motion.div
              className="flex gap-2 py-2 px-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Button
                size="sm"
                variant={!selectedTag ? "default" : "outline"}
                onClick={() => setSelectedTag(null)}
                className="shrink-0"
              >
                All Posts
              </Button>
              {allTags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                >
                  <Button
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className="shrink-0 group"
                  >
                    <Tag className="w-3 h-3 mr-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                    {tag}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </ScrollArea>
        </motion.div>

        {/* Blog Posts Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            ref={ref}
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pb-20"
          >
            {filteredPosts
              .sort((a, b) => {
                if (activeFilter === 'latest') {
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
                return (b.views || 0) - (a.views || 0);
              })
              .map((post, index) => (
                <motion.div
                  key={post._id}
                  variants={item}
                  layout
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <MotionCard
                      className="h-full overflow-hidden bg-card/30 backdrop-blur-sm border-primary/5 hover:border-primary/20 transition-all duration-500"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {post.coverImage && (
                        <div className="relative h-48 overflow-hidden">
                          <motion.img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      )}
                      <CardContent className="p-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="relative">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-primary/10 text-primary border-primary/20"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                            {post.title}
                          </h2>
                          <p className="text-muted-foreground line-clamp-2 mb-4 group-hover:text-foreground/80 transition-colors duration-300">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{Math.ceil(post.content.length / 1000)} min read</span>
                              </div>
                            </div>
                            <motion.div
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowRight className="h-5 w-5" />
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </MotionCard>
                  </Link>
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-block p-6 bg-card/30 backdrop-blur-sm rounded-lg border border-primary/10">
              <Search className="h-12 w-12 text-primary/50 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No blog posts found. Try adjusting your search or filters.
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
