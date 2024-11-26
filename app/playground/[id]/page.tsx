'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import { Card } from '@/components/shared/ui/data-display/card';
import { Button } from '@/components/shared/ui/core/button';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/navigation/tabs';
import { Play, RefreshCw, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import FloatingNav from "@/components/shared/ui/navigation/FloatingNavbar";
import { FaHome, FaBriefcase, FaBlog, FaGamepad, FaEnvelope } from 'react-icons/fa';
import { SiJavascript, SiPython } from 'react-icons/si';
import SubmitSolutionButton from '@/components/features/playground/SubmitSolutionButton';
import HintSection from '@/components/features/playground/HintSection';
import ReactMarkdown from 'react-markdown';

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <FaHome className="w-4 h-4" />,
  },
  {
    name: "Portfolio",
    link: "/portfolio",
    icon: <FaBriefcase className="w-4 h-4" />,
  },
  {
    name: "Playground",
    link: "/playground",
    icon: <FaGamepad className="w-4 h-4" />,
  },
  {
    name: "Blog",
    link: "/blog",
    icon: <FaBlog className="w-4 h-4" />,
  },
  {
    name: "Contact",
    link: "/contact",
    icon: <FaEnvelope className="w-4 h-4" />,
  },
];

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hints: string[];
  starterCode: {
    javascript: string;
    python: string;
  };
  testCases?: Array<{
    input: any;
    output: string;
  }>;
}

export default function ChallengePage() {
  const params = useParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');

  const defaultCode = {
    javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
    python: `def two_sum(nums, target):
    # Write your solution here
    pass`
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`/api/playground/challenges/${params.id}`);
        if (!response.ok) throw new Error('Challenge not found');
        const data = await response.json();
        setChallenge(data);
        setCode(data.starterCode[language] || defaultCode[language]);
      } catch (error) {
        console.error('Error fetching challenge:', error);
      }
    };

    if (params.id) {
      fetchChallenge();
    }
  }, [params.id, language]);

  const runCode = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/playground/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          testCases: challenge?.testCases,
        }),
      });

      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('Error running code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  if (!challenge) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FloatingNav items={navItems} />
      {/* Language Selection */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant={language === 'javascript' ? 'default' : 'outline'}
          size="lg"
          onClick={() => {
            setLanguage('javascript');
            setCode(challenge.starterCode.javascript || defaultCode.javascript);
          }}
          className={`w-48 flex items-center gap-3 transition-all duration-300 relative overflow-hidden group h-16 
            ${language === 'javascript' 
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 hover:from-yellow-500/30 hover:to-yellow-500/20 border-yellow-500/50' 
              : 'hover:border-yellow-500/50 hover:text-yellow-500'}`}
        >
          <div className="relative">
            <SiJavascript className={`w-8 h-8 transition-all duration-300 group-hover:scale-110 
              ${language === 'javascript' ? 'text-yellow-400' : 'text-yellow-500/70 group-hover:text-yellow-500'}`} />
            <div className={`absolute inset-0 blur-lg transition-opacity duration-300 
              ${language === 'javascript' ? 'opacity-100' : 'opacity-0'} 
              group-hover:opacity-100 bg-yellow-400/30`} />
          </div>
          <span className={`font-medium transition-colors duration-300 
            ${language === 'javascript' ? 'text-black dark:text-white' : 'group-hover:text-yellow-500'}`}>
            JavaScript
          </span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 animate-shimmer" />
          </div>
        </Button>

        <Button
          variant={language === 'python' ? 'default' : 'outline'}
          size="lg"
          onClick={() => {
            setLanguage('python');
            setCode(challenge.starterCode.python || defaultCode.python);
          }}
          className={`w-48 flex items-center gap-3 transition-all duration-300 relative overflow-hidden group h-16 
            ${language === 'python' 
              ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/10 hover:from-blue-500/30 hover:to-blue-500/20 border-blue-500/50' 
              : 'hover:border-blue-500/50 hover:text-blue-500'}`}
        >
          <div className="relative">
            <SiPython className={`w-8 h-8 transition-all duration-300 group-hover:scale-110 
              ${language === 'python' ? 'text-blue-400' : 'text-blue-500/70 group-hover:text-blue-500'}`} />
            <div className={`absolute inset-0 blur-lg transition-opacity duration-300 
              ${language === 'python' ? 'opacity-100' : 'opacity-0'} 
              group-hover:opacity-100 bg-blue-400/30`} />
          </div>
          <span className={`font-medium transition-colors duration-300 
            ${language === 'python' ? 'text-black dark:text-white' : 'group-hover:text-blue-500'}`}>
            Python
          </span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 animate-shimmer" />
          </div>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Challenge Description */}
        <div className="space-y-6">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-1 rounded text-sm ${
                challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {challenge.difficulty}
              </span>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{challenge.description}</ReactMarkdown>
            </div>
          </Card>

          {/* Hint Section */}
          <HintSection hints={challenge.hints} />

          {/* Test Cases Section */}
          {challenge.testCases && challenge.testCases.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
              <div className="space-y-4">
                {challenge.testCases.map((testCase, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <div className="mb-2">
                      <span className="font-medium">Input:</span>{' '}
                      <code className="bg-background p-1 rounded">
                        {JSON.stringify(testCase.input, null, 2)}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium">Expected Output:</span>{' '}
                      <code className="bg-background p-1 rounded">
                        {testCase.output}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Code Editor and Output */}
        <div className="space-y-6">
          <Card className="p-6">
            <Editor
              height="400px"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                formatOnPaste: true,
                formatOnType: true,
                automaticLayout: true,
                tabSize: language === 'python' ? 4 : 2,
                detectIndentation: true,
                wordWrap: 'on'
              }}
            />
            <div className="flex justify-between mt-4">
              <Button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Run Code'
                )}
              </Button>
              <SubmitSolutionButton code={code} challengeId={params.id as string} />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Output</h3>
            <pre className="bg-secondary/10 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap min-h-[200px] max-h-[400px] overflow-auto">
              {output || 'Run your code to see the output...'}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  );
}
