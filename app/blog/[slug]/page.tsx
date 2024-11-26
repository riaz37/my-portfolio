'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import { Eye, Clock, Calendar, ChevronLeft, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import SectionTransition from "@/components/shared/ui/SectionTransition";
import TableOfContents from "@/components/features/blog/TableOfContents";
import ReadingProgress from "@/components/features/blog/ReadingProgress";
import ShareButtons from "@/components/features/blog/ShareButtons";
import { cn } from '@/lib/utils';

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
}

export default function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog?slug=${params.slug}`);
        if (!response.ok) {
          throw new Error('Post not found');
        }
        const data = await response.json();
        if (!data.data) {
          throw new Error('Invalid response format');
        }
        setPost(data.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  useEffect(() => {
    const updateReadingProgress = () => {
      const element = document.documentElement;
      const scrollTop = element.scrollTop || document.body.scrollTop;
      const scrollHeight = element.scrollHeight || document.body.scrollHeight;
      const clientHeight = element.clientHeight;
      
      const windowHeight = scrollHeight - clientHeight;
      const progress = Math.round((scrollTop / windowHeight) * 100);
      
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-[500px] w-full rounded-xl" />
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <SectionTransition>
      <div className="min-h-screen relative">
        <ReadingProgress progress={readingProgress} />
        
        {/* Hero Section */}
        <div className="relative">
          <div className="relative h-[60vh] overflow-hidden">
            <Image
              src={post.coverImage || '/images/placeholder.jpg'}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
            
            {/* Navigation */}
            <nav className="absolute top-0 left-0 right-0 z-10">
              <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                <Link href="/blog">
                  <Button variant="secondary" size="sm" className="gap-2 backdrop-blur-sm bg-background/50">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Blog
                  </Button>
                </Link>
                <ShareButtons url={`/blog/${post.slug}`} title={post.title} />
              </div>
            </nav>
          </div>

          {/* Content Section */}
          <div className="container mx-auto px-4 -mt-32 relative mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Content */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-8 bg-background border rounded-xl p-8 shadow-lg space-y-8"
              >
                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">{post.title}</h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-b pb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.createdAt}>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{estimateReadingTime(post.content)} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{post.views.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              </motion.article>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-8">
                <div className="sticky top-8">
                  <div className="bg-background border rounded-xl p-6 shadow-lg">
                    <TableOfContents content={post.content} />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </SectionTransition>
  );
}
