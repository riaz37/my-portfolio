'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, Video, Link as LinkIcon, Code, FileText } from 'lucide-react';
import { Input } from '@/components/shared/ui/core/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/ui/data-display/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/navigation/tabs';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { Button } from '@/components/shared/ui/core/button';
import YouTubeVideo from '@/components/sections/YouTubeVideo';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'documentation' | 'video' | 'article' | 'project' | 'tutorial';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoId?: string;
}

const INITIAL_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Next.js Documentation',
    description: 'Official documentation for Next.js framework',
    url: 'https://nextjs.org/docs',
    type: 'documentation',
    tags: ['next.js', 'react', 'web development'],
    difficulty: 'beginner',
  },
  {
    id: '2',
    title: 'TypeScript Handbook',
    description: 'Complete guide to TypeScript programming language',
    url: 'https://www.typescriptlang.org/docs/',
    type: 'documentation',
    tags: ['typescript', 'javascript', 'programming'],
    difficulty: 'intermediate',
  },
  {
    id: '3',
    title: 'Building a Modern Portfolio',
    description: 'Step-by-step guide to building a portfolio website',
    url: '/blog/building-modern-portfolio',
    type: 'article',
    tags: ['portfolio', 'next.js', 'react'],
    difficulty: 'intermediate',
  },
  {
    id: '4',
    title: 'Next.js Crash Course',
    description: 'Learn Next.js fundamentals in this comprehensive tutorial',
    url: '#',
    type: 'video',
    videoId: 'mTz0GXj8NN0',
    tags: ['next.js', 'react', 'tutorial'],
    difficulty: 'beginner',
  },
  {
    id: '5',
    title: 'TypeScript for Beginners',
    description: 'Complete TypeScript tutorial for beginners',
    url: '#',
    type: 'video',
    videoId: '30LWjhZzg50',
    tags: ['typescript', 'programming', 'tutorial'],
    difficulty: 'beginner',
  }
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredResources = INITIAL_RESOURCES.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;

    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'documentation':
        return <Book className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'project':
        return <Code className="h-4 w-4" />;
      case 'tutorial':
        return <Book className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold">Learning Resources</h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Curated collection of documentation, tutorials, videos, and articles to help you learn and improve your skills.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setSelectedType}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="documentation">Docs</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
            <TabsTrigger value="article">Articles</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setSelectedDifficulty}>
          <TabsList>
            <TabsTrigger value="all">All Levels</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(resource.type)}
                    <Badge variant="secondary">
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </Badge>
                  </div>
                  <Badge variant="outline">{resource.difficulty}</Badge>
                </div>
                <CardTitle className="text-xl mt-2">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {resource.type === 'video' && resource.videoId && (
                  <div className="relative w-full pt-[56.25%] mb-4">
                    <div className="absolute inset-0">
                      <YouTubeVideo
                        videoId={resource.videoId}
                        title={resource.title}
                        description={resource.description}
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {resource.type !== 'video' && (
                  <div className="mt-auto">
                    <Button asChild className="w-full">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        View Resource
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
