'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/shared/ui/data-display/card';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { Input } from '@/components/shared/ui/core/input';
import { Button } from '@/components/shared/ui/core/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/core/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/navigation/tabs';
import { Search, Filter, Star, Clock, Users, ArrowRight, Code2, Blocks, Book, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  completionRate?: number;
  totalAttempts?: number;
  timeEstimate?: string;
}

const difficultyConfig = {
  Easy: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  Medium: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  Hard: { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' }
};

const categoryConfig = {
  Arrays: { icon: Blocks, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  Strings: { icon: Book, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  'Dynamic Programming': { icon: Brain, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  Algorithms: { icon: Code2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
};

const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  const difficulty = difficultyConfig[challenge.difficulty];
  const category = categoryConfig[challenge.category as keyof typeof categoryConfig] || categoryConfig.Algorithms;
  const CategoryIcon = category.icon;

  return (
    <Link href={`/playground/challenges/${challenge.id}`} className="block">
      <Card className="h-full group hover:shadow-lg transition-all duration-300">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className={cn("p-2 rounded-lg", category.bg)}>
              <CategoryIcon className={cn("w-4 h-4", category.color)} />
            </div>
            <Badge variant="outline" className={cn(
              "px-2 py-0.5 text-xs font-medium",
              difficulty.color,
              difficulty.bg,
              difficulty.border
            )}>
              {challenge.difficulty}
            </Badge>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {challenge.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {challenge.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4" />
              <span>{challenge.completionRate}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{challenge.totalAttempts}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{challenge.timeEstimate}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'compact'>('grid');

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('/api/playground/challenges');
        if (!response.ok) throw new Error('Failed to fetch challenges');
        const data = await response.json();
        const enhancedData = data.map((challenge: Challenge) => ({
          ...challenge,
          completionRate: Math.floor(Math.random() * 100),
          totalAttempts: Math.floor(Math.random() * 10000),
          timeEstimate: ['5-10 min', '10-15 min', '15-20 min', '20-30 min'][Math.floor(Math.random() * 4)]
        }));
        setChallenges(enhancedData);
      } catch (error) {
        console.error('Error:', error);
        setChallenges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficulty === 'all' || challenge.difficulty.toLowerCase() === difficulty.toLowerCase();
    const matchesCategory = category === 'all' || challenge.category === category;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const categories = Array.from(new Set(challenges.map(c => c.category))).filter(Boolean);

  return (
    <div className="min-h-screen">
      <div className="relative">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              Coding Challenges
            </h1>
            <p className="text-lg text-muted-foreground">
              Practice your coding skills with our curated collection of challenges.
              From arrays to algorithms, find the perfect challenge for your skill level.
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-5xl mx-auto mb-12 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search challenges..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {filteredChallenges.length} challenges found
              </div>
              <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'compact')} className="w-auto">
                <TabsList className="grid w-24 grid-cols-2">
                  <TabsTrigger value="grid">
                    <div className="i-lucide-grid-2x2 w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="compact">
                    <div className="i-lucide-list w-4 h-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Challenge Grid */}
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="h-[200px] animate-pulse">
                      <div className="p-6 space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="h-4 bg-muted rounded w-1/4" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredChallenges.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No challenges found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <motion.div
                  className={cn(
                    "grid gap-6",
                    view === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1 max-w-3xl mx-auto'
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filteredChallenges.map((challenge) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChallengeCard challenge={challenge} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
