'use client';

import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  ShareIcon, 
  CalendarIcon, 
  TagIcon, 
  BookOpenIcon,
  EyeIcon,
  ThumbsUpIcon,
  ChevronLeft,
  Twitter,
  Linkedin,
  Facebook,
  Link2
} from 'lucide-react';

import { Badge } from "@/components/shared/ui/core/badge";
import { Button } from "@/components/shared/ui/core/button";
import { Markdown } from "@/components/shared/ui/core/markdown";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shared/ui/data-display/avatar";
import { cn, formatDate } from '@/lib/utils';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { ReadingProgress } from '@/components/shared/ui/core/reading-progress';
import Loading from './loading';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/shared/ui/core/tooltip";

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

const shareButtons = [
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'hover:text-blue-400',
    getUrl: (url: string, title: string) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'hover:text-blue-600',
    getUrl: (url: string) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'hover:text-blue-500',
    getUrl: (url: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
];

export default function BlogPost({ blog }: { blog: BlogPost }) {
  const { data: session } = useSession();
  const { toast } = useCustomToast();

  const handleShare = async (type?: string, url?: string) => {
    try {
      if (url) {
        window.open(url, '_blank');
        return;
      }

      if (type === 'copy') {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          variant: "default",
          title: "Link copied",
          description: "Blog post URL has been copied to your clipboard.",
        });
        return;
      }

      await navigator.share({
        title: blog.title,
        text: blog.description,
        url: window.location.href,
      });
      toast({
        variant: "default",
        title: "Shared!",
        description: "Blog post has been shared successfully.",
      });
    } catch (err) {
      if (type !== 'copy') {
        await handleShare('copy');
      }
    }
  };

  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <Suspense fallback={<Loading />}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-background"
        >
          <ReadingProgress />

          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur z-40 border-b">
            <div className="container h-full flex items-center">
              <Link
                href="/blog"
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "text-sm font-medium",
                  "transition-all hover:text-foreground/80",
                  "text-foreground/60 hover:text-foreground"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </div>
          </nav>

          <div className="container pt-24 pb-16">
            <main className="max-w-3xl mx-auto">
              {/* Hero Section */}
              <header className="mb-12">
                {!blog.isPublished && isAdmin && (
                  <Badge variant="secondary" className="mb-4">Draft</Badge>
                )}
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                  {blog.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {blog.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-background">
                      {blog.author.image ? (
                        <AvatarImage src={blog.author.image} alt={blog.author.name} />
                      ) : (
                        <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{blog.author.name}</div>
                      <time dateTime={blog.publishedAt || blog.createdAt}>
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </time>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {blog.readingTime && (
                      <div className="flex items-center gap-1">
                        <BookOpenIcon className="h-4 w-4" />
                        <span>{blog.readingTime} min read</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      <span>{blog.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUpIcon className="h-4 w-4" />
                      <span>{blog.likes} likes</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {blog.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="px-3 py-1"
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </header>

              {/* Cover Image */}
              {blog.coverImage && (
                <div className="relative aspect-video mb-12 rounded-lg overflow-hidden">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Content */}
              <article className="prose prose-lg dark:prose-invert max-w-none">
                <Markdown content={blog.content} />
              </article>
            </main>
          </div>

          {/* Share Buttons */}
          <div className="fixed bottom-8 right-8 z-50">
            <TooltipProvider>
              <div className="flex flex-col gap-2 items-center">
                {shareButtons.map((btn) => (
                  <Tooltip key={btn.name}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                          btn.color
                        )}
                        onClick={() => handleShare(btn.name.toLowerCase(), btn.getUrl(window.location.href, blog.title))}
                      >
                        <btn.icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Share on {btn.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                      onClick={() => handleShare('copy')}
                    >
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Copy link</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
}
