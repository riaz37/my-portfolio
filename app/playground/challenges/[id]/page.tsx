'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { Button } from '@/components/shared/ui/core/button';
import { Card } from '@/components/shared/ui/data-display/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/shared/ui/navigation/tabs';
import { cn } from '@/lib/utils';
import { FaLightbulb, FaCheck } from 'react-icons/fa';

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
  testCases: {
    input: any;
    output: string;
  }[];
}

export default function ChallengePage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [showHints, setShowHints] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Simulated data loading
  useState(() => {
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
        testCases: [
          { input: { nums: [2, 7, 11, 15], target: 9 }, output: '[0, 1]' },
          { input: { nums: [3, 2, 4], target: 6 }, output: '[1, 2]' },
        ],
      });
      setCode('function twoSum(nums, target) {\n  // Your code here\n}');
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping" />
          <div className="absolute inset-0 border-4 border-primary rounded-full animate-spin-slow" 
            style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-4xl">😕</div>
        <h2 className="text-2xl font-bold">Challenge Not Found</h2>
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-card rounded-xl border shadow-sm">
        {/* Top Bar */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => window.history.back()} size="icon">
                <div className="i-lucide-chevron-left w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{challenge.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "px-3 py-1",
                      challenge.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      challenge.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    )}
                  >
                    {challenge.difficulty}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">{challenge.category}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  // Add run logic here
                  // console.log('Running code:', code);
                }}
              >
                <div className="i-lucide-play w-4 h-4" />
                Run
              </Button>
              <Button variant="default" size="sm" className="gap-2">
                <FaCheck className="w-4 h-4" />
                Submit
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-[minmax(0,1fr),minmax(0,1.5fr)] divide-x h-[calc(100vh-16rem)]">
          {/* Left Panel - Problem Description */}
          <div className="p-6 space-y-6 overflow-y-auto">
            <div className="space-y-1">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger 
                    value="description"
                    className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger 
                    value="hints"
                    className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                  >
                    Hints
                  </TabsTrigger>
                </TabsList>
                <div className="pt-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'description' ? (
                      <motion.div
                        key="description"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="prose dark:prose-invert max-w-none"
                      >
                        <p className="text-muted-foreground leading-relaxed">{challenge.description}</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="hints"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <ul className="space-y-3">
                          {challenge.hints.map((hint, index) => (
                            <li key={index} className="flex items-start gap-3 text-muted-foreground">
                              <FaLightbulb className="w-5 h-5 mt-0.5 text-yellow-500" />
                              <span>{hint}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Tabs>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Cases</h3>
              <div className="space-y-4">
                {challenge.testCases.map((testCase, index) => (
                  <div key={index} className="space-y-3 p-4 rounded-lg bg-muted">
                    <div>
                      <p className="text-sm font-medium mb-2">Input:</p>
                      <pre className="text-sm bg-background p-3 rounded-md overflow-x-auto">
                        {JSON.stringify(testCase.input, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Expected Output:</p>
                      <pre className="text-sm bg-background p-3 rounded-md overflow-x-auto">
                        {testCase.output}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-2 border-b bg-muted/30">
              <Tabs value={language} onValueChange={setLanguage} className="w-full">
                <div className="flex items-center justify-between px-2">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="javascript" className="data-[state=active]:bg-background">JavaScript</TabsTrigger>
                    <TabsTrigger value="python" className="data-[state=active]:bg-background">Python</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')}
                    >
                      {editorTheme === 'vs-dark' ? (
                        <div className="i-lucide-sun w-4 h-4" />
                      ) : (
                        <div className="i-lucide-moon w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCode(challenge.starterCode[language])}
                    >
                      <div className="i-lucide-rotate-ccw w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Tabs>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                language={language}
                value={code}
                theme={editorTheme}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
