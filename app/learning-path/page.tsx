'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/shared/ui/core/badge';
import { Button } from '@/components/shared/ui/core/button';
import { Card } from '@/components/shared/ui/core/card';
import { Progress } from '@/components/shared/ui/feedback/progress';
import { BookOpen, Code2, Brain, Rocket, Lock, CheckCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Loading } from '@/components/shared/loading';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  progress: number;
  modules: {
    id: string;
    title: string;
    description: string;
    duration: string;
    completed: boolean;
    locked: boolean;
  }[];
}

const learningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Master the core concepts of web development including HTML, CSS, and JavaScript.',
    difficulty: 'Beginner',
    category: 'Web Development',
    progress: 75,
    modules: [
      {
        id: 'm1',
        title: 'HTML Basics',
        description: 'Learn the building blocks of web pages',
        duration: '2 hours',
        completed: true,
        locked: false,
      },
      {
        id: 'm2',
        title: 'CSS Styling',
        description: 'Style your web pages with CSS',
        duration: '3 hours',
        completed: true,
        locked: false,
      },
      {
        id: 'm3',
        title: 'JavaScript Fundamentals',
        description: 'Add interactivity to your websites',
        duration: '4 hours',
        completed: false,
        locked: false,
      },
      {
        id: 'm4',
        title: 'Responsive Design',
        description: 'Make your websites work on all devices',
        duration: '2 hours',
        completed: false,
        locked: true,
      },
    ],
  },
  {
    id: '2',
    title: 'React Development',
    description: 'Learn modern React development with hooks, state management, and best practices.',
    difficulty: 'Intermediate',
    category: 'Frontend',
    progress: 30,
    modules: [
      {
        id: 'm1',
        title: 'React Basics',
        description: 'Understanding components and JSX',
        duration: '3 hours',
        completed: true,
        locked: false,
      },
      {
        id: 'm2',
        title: 'React Hooks',
        description: 'Master useState and useEffect',
        duration: '4 hours',
        completed: false,
        locked: false,
      },
      {
        id: 'm3',
        title: 'State Management',
        description: 'Learn Redux and Context API',
        duration: '5 hours',
        completed: false,
        locked: true,
      },
    ],
  },
];

const difficultyConfig = {
  Beginner: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  Intermediate: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  Advanced: { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
};

export default function LearningPathPage() {
  const { data: session, status } = useSession();
  const [userProgress, setUserProgress] = useState<{ [pathId: string]: number }>({});

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          const progressPromises = learningPaths.map(async (path) => {
            const response = await fetch(`/api/learning-paths/progress?learningPathId=${path.id}`);
            if (!response.ok) {
              console.error('Failed to fetch progress');
              return null;
            }
            return response.json();
          });

          const progressResults = await Promise.all(progressPromises);
          const progressMap = progressResults.reduce((acc, progress, index) => {
            if (progress) {
              acc[learningPaths[index].id] = progress.percentage || 0;
            }
            return acc;
          }, {});

          setUserProgress(progressMap);
        } catch (error) {
          console.error('Error fetching user progress:', error);
        }
      }
    };

    fetchUserProgress();
  }, [session, status]);

  if (status === 'loading') {
    return <Loading text="Loading learning paths..." />;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Please Sign In</h2>
          <p className="text-white/60 mb-6">You need to be logged in to view learning paths.</p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6">Learning Paths</h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Choose your path and start learning with our structured courses designed to take you from
            beginner to expert.
          </p>
        </motion.div>

        {/* Learning Paths Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {learningPaths.map((path, pathIndex) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: pathIndex * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 overflow-hidden">
                <div className="p-6">
                  {/* Path Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{path.title}</h2>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`${difficultyConfig[path.difficulty].color} ${
                            difficultyConfig[path.difficulty].bg
                          } ${difficultyConfig[path.difficulty].border}`}
                        >
                          {path.difficulty}
                        </Badge>
                        <Badge variant="outline" className="bg-white/5">
                          {path.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">
                        {userProgress[path.id] || path.progress}%
                      </div>
                      <div className="text-sm text-white/60">Completed</div>
                    </div>
                  </div>

                  <p className="text-white/60 mb-6">{path.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <Progress 
                      value={userProgress[path.id] || path.progress} 
                      className="h-2 bg-white/10" 
                    />
                  </div>

                  {/* Modules List */}
                  <div className="space-y-4">
                    {path.modules.map((module) => (
                      <div
                        key={module.id}
                        className={`p-4 rounded-lg transition-colors ${
                          module.locked
                            ? 'bg-white/5 opacity-50'
                            : 'bg-white/10 hover:bg-white/20 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {module.completed ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                            ) : module.locked ? (
                              <Lock className="w-5 h-5 text-white/40" />
                            ) : (
                              <Brain className="w-5 h-5 text-blue-400" />
                            )}
                            <h3 className="font-semibold">{module.title}</h3>
                          </div>
                          <div className="text-sm text-white/60">{module.duration}</div>
                        </div>
                        <p className="text-sm text-white/60 ml-8">{module.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="mt-6">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      {(userProgress[path.id] || path.progress) === 0 ? (
                        <>
                          Start Learning
                          <Rocket className="w-4 h-4 ml-2" />
                        </>
                      ) : (userProgress[path.id] || path.progress) === 100 ? (
                        <>
                          Review Path
                          <BookOpen className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Continue Learning
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
