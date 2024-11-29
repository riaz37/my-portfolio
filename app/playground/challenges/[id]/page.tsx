'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import { Badge } from '@/components/shared/ui/core/badge';
import { Button } from '@/components/shared/ui/core/button';
import { Card } from '@/components/shared/ui/core/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shared/ui/navigation/tabs';
import { cn } from '@/lib/utils';
import { Loading } from '@/components/shared/loading';
import { ArrowLeft, Code2, Play, LightbulbIcon, CheckCircle2, Info, BookOpen, Terminal, BrainCircuit, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import { SolutionViewer } from '@/components/features/playground/SolutionViewer';
import { CodeRunner } from '@/components/features/playground/CodeRunner';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  hints: string[];
  starterCode: {
    javascript: string;
    python: string;
  };
  solutionCode: {
    javascript: string;
    python: string;
  };
  testCases: {
    input: any;
    output: string;
  }[];
}

const difficultyConfig = {
  Easy: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  Medium: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  Hard: { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' }
};

export default function ChallengePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState({ javascript: '', python: '' });
  const [output, setOutput] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        // Simulated API call
        setTimeout(() => {
          setChallenge({
            id: '1',
            title: 'Two Sum',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            difficulty: 'Easy',
            category: 'Arrays',
            hints: [
              'Consider using a hash map to store complements',
              'You can solve this in one pass through the array',
            ],
            starterCode: {
              javascript: 'function twoSum(nums, target) {\n  // Your code here\n}',
              python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
            },
            solutionCode: {
              javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return null;\n}',
              python: 'def two_sum(nums, target):\n    num_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in num_map:\n            return [num_map[complement], i]\n        num_map[num] = i\n    return None',
            },
            testCases: [
              { input: { nums: [2, 7, 11, 15], target: 9 }, output: '[0, 1]' },
              { input: { nums: [3, 2, 4], target: 6 }, output: '[1, 2]' },
            ],
          });
          setCode({ javascript: 'function twoSum(nums, target) {\n  // Your code here\n}', python: 'def two_sum(nums, target):\n    # Your code here\n    pass' });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading challenge:', error);
        setLoading(false);
      }
    };

    loadChallenge();
  }, [params.id]);

  const handleRunCode = async () => {
    setOutput('Running tests...');
    // Simulate code execution
    setTimeout(() => {
      setOutput('All test cases passed! 🎉');
    }, 1500);
  };

  if (loading) {
    return <Loading text="Loading challenge..." />;
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-4xl">😕</div>
        <h2 className="text-2xl font-bold">Challenge Not Found</h2>
        <Button variant="outline" asChild>
          <Link href="/playground/challenges">Go Back</Link>
        </Button>
      </div>
    );
  }

  const difficulty = difficultyConfig[challenge.difficulty];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-4 -top-4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute -right-4 -top-4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-primary/10 transition-colors self-start"
            >
              <Link href="/playground/challenges" className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
              >
                {challenge.title}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-3 mt-2"
              >
                <Badge
                  variant="outline"
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-full',
                    difficultyConfig[challenge.difficulty].color,
                    difficultyConfig[challenge.difficulty].bg,
                    difficultyConfig[challenge.difficulty].border
                  )}
                >
                  {challenge.difficulty}
                </Badge>
                <Badge 
                  variant="outline" 
                  className="bg-primary/5 hover:bg-primary/10 transition-colors px-3 py-1 text-sm rounded-full"
                >
                  {challenge.category}
                </Badge>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Description and test cases */}
          <div className="space-y-6">
            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <Tabs defaultValue="description" className="w-full" onValueChange={setActiveTab}>
                <div className="flex items-center justify-between p-2 border-b border-border/50">
                  <TabsList className="grid grid-cols-2 w-full sm:w-auto">
                    <TabsTrigger value="description" className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden sm:inline">Description</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="hints" 
                      className="flex items-center gap-2"
                      disabled={!isAuthenticated}
                    >
                      <LightbulbIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Hints</span>
                      {!isAuthenticated && <Lock className="w-3 h-3 ml-1" />}
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="description" className="p-6">
                  <p className="text-foreground/80 leading-relaxed">{challenge.description}</p>
                </TabsContent>
                <TabsContent value="hints" className="p-6">
                  {isAuthenticated ? (
                    <ul className="space-y-4">
                      {challenge.hints.map((hint, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 group"
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0 relative" />
                          </div>
                          <p className="text-foreground/80">{hint}</p>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="rounded-full bg-primary/10 p-3 mb-4">
                        <Lock className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Hints are Locked</h3>
                      <p className="text-sm text-muted-foreground mb-4">Sign in to unlock hints and get help with the challenge</p>
                      <Button
                        onClick={() => signIn()}
                        className="bg-primary/10 hover:bg-primary/20 text-primary"
                      >
                        Sign In to Access
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>

            {/* Test cases */}
            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-sm rounded-full" />
                    <BrainCircuit className="w-5 h-5 relative" />
                  </div>
                  Test Cases
                </h3>
                <div className="space-y-4">
                  {challenge.testCases.map((testCase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background/70 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 relative" />
                          </div>
                          <span className="text-sm font-medium">Test Case {index + 1}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-foreground/60">Input:</span>{' '}
                            <code className="px-2 py-1 rounded bg-primary/10 text-primary">{JSON.stringify(testCase.input)}</code>
                          </div>
                          <div className="text-sm">
                            <span className="text-foreground/60">Expected Output:</span>{' '}
                            <code className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">{testCase.output}</code>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right column - Code editor */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Tabs defaultValue="javascript" className="w-full">
                <TabsList>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>
                <TabsContent value="javascript">
                  <div className="relative">
                    <Editor
                      height="400px"
                      theme="vs-dark"
                      defaultLanguage="javascript"
                      defaultValue={challenge.starterCode.javascript}
                      onChange={(value) => setCode({ ...code, javascript: value || '' })}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                      }}
                    />
                  </div>
                  <CodeRunner
                    code={code.javascript}
                    language="javascript"
                    testCases={challenge.testCases}
                  />
                </TabsContent>
                <TabsContent value="python">
                  <div className="relative">
                    <Editor
                      height="400px"
                      theme="vs-dark"
                      defaultLanguage="python"
                      defaultValue={challenge.starterCode.python}
                      onChange={(value) => setCode({ ...code, python: value || '' })}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                      }}
                    />
                  </div>
                  <CodeRunner
                    code={code.python}
                    language="python"
                    testCases={challenge.testCases}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Solution viewer */}
            <SolutionViewer 
              javascript={challenge.solutionCode.javascript} 
              python={challenge.solutionCode.python} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
