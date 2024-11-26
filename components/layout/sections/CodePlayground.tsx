"use client";

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/shared/ui/core/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/ui/core/select";
import { Card } from '@/components/shared/ui/data-display/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/ui/navigation/tabs";
import { Badge } from "@/components/shared/ui/data-display/badge";
import { Play, Share2, Download, Copy, RefreshCw, Layout, Rocket, LightbulbIcon } from 'lucide-react';

interface TutorialStep {
  title: string;
  content: string;
}

interface Challenge {
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  steps: TutorialStep[];
  hints: string[];
  code: string;
  solution: string;
  testCases: { input: any, output: any }[];
}

const challenges: { [key: string]: Challenge[] } = {
  javascript: [
    {
      title: "Two Sum",
      category: "Algorithms",
      difficulty: "Beginner",
      description: "Write a function that finds two numbers in an array that add up to a target sum.",
      steps: [
        {
          title: "Understand the Problem",
          content: "You need to find indices of two numbers that add up to the target."
        },
        {
          title: "Consider Edge Cases",
          content: "What if there's no solution? What if there are multiple solutions?"
        },
        {
          title: "Optimize Solution",
          content: "Can you do it in one pass using a hash map?"
        }
      ],
      hints: [
        "Use a hash map to store complement values",
        "Check if current number's complement exists in map",
        "Remember to handle edge cases"
      ],
      code: `function twoSum(nums, target) {
  // Write your solution here
  
}

// Example usage:
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target));`,
      solution: "[0, 1]",
      testCases: [
        { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
        { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
        { input: { nums: [3, 3], target: 6 }, output: [0, 1] }
      ]
    }
  ],
  python: [
    {
      title: "Two Sum",
      category: "Algorithms",
      difficulty: "Beginner",
      description: "Write a function that finds two numbers in an array that add up to a target sum.",
      steps: [
        {
          title: "Understand the Problem",
          content: "You need to find indices of two numbers that add up to the target."
        },
        {
          title: "Consider Edge Cases",
          content: "What if there's no solution? What if there are multiple solutions?"
        },
        {
          title: "Optimize Solution",
          content: "Can you do it in one pass using a dictionary?"
        }
      ],
      hints: [
        "Use a dictionary to store complement values",
        "Check if current number's complement exists in dict",
        "Remember to handle edge cases"
      ],
      code: `def two_sum(nums, target):
    # Write your solution here
    pass

# Example usage:
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))`,
      solution: "[0, 1]",
      testCases: [
        { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
        { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
        { input: { nums: [3, 3], target: 6 }, output: [0, 1] }
      ]
    }
  ]
};

const themes = ['vs-dark', 'light'] as const;
const languages = ['javascript', 'python'] as const;

const defaultCode = {
  javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}

// Example usage:
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target));`,
  python: `def two_sum(nums, target):
    # Write your solution here
    pass

# Example usage:
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))`
};

const CodePlayground = () => {
  const [language, setLanguage] = useState<typeof languages[number]>('javascript');
  const [activeChallenge, setActiveChallenge] = useState('0');
  const [code, setCode] = useState(challenges[language][0]?.code || '');
  const [output, setOutput] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [theme, setTheme] = useState<typeof themes[number]>('vs-dark');
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');

  useEffect(() => {
    // Reset to first challenge when language changes
    const currentChallenges = challenges[language];
    const defaultChallenge = currentChallenges[0];
    if (defaultChallenge) {
      setActiveChallenge('0');
      setCode(defaultChallenge.code);
      setOutput('');
      setShowSolution(false);
    }
  }, [language]);

  const handleLanguageChange = (newLanguage: typeof languages[number]) => {
    setLanguage(newLanguage);
  };

  const handleChallengeChange = (challengeIndex: string) => {
    const currentChallenges = challenges[language];
    const selectedChallenge = currentChallenges[parseInt(challengeIndex)];
    if (selectedChallenge) {
      setActiveChallenge(challengeIndex);
      setCode(selectedChallenge.code);
      setOutput('');
      setShowSolution(false);
    }
  };

  const handleRunCode = async () => {
    setOutput('Running...');
    
    try {
      const currentChallenge = challenges[language][parseInt(activeChallenge)];
      const response = await fetch('/api/playground/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          testCases: currentChallenge.testCases
        }),
      });

      const data = await response.json();
      setOutput(data.output);
      
      // Show success message if all tests pass
      if (data.success) {
        setOutput(prev => prev + '\n\nCongratulations! All tests passed! 🎉');
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground-${language}-${Date.now()}.${language === 'python' ? 'py' : 'js'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShareCode = () => {
    const shareUrl = `${window.location.origin}/playground?code=${encodeURIComponent(code)}&lang=${language}`;
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="w-full space-y-8">
      {/* Language Selection */}
      <div className="flex justify-center gap-4">
        <Button
          variant={language === 'javascript' ? 'default' : 'outline'}
          size="lg"
          onClick={() => {
            setLanguage('javascript');
            setCode(defaultCode['javascript']);
          }}
          className="w-40 flex items-center gap-2 transition-all duration-300"
        >
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          JavaScript
        </Button>
        <Button
          variant={language === 'python' ? 'default' : 'outline'}
          size="lg"
          onClick={() => {
            setLanguage('python');
            setCode(defaultCode['python']);
          }}
          className="w-40 flex items-center gap-2 transition-all duration-300"
        >
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          Python
        </Button>
      </div>

      {/* Editor Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4">
          <Select
            value={theme}
            onValueChange={(value: typeof themes[number]) => setTheme(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vs-dark">Dark Theme</SelectItem>
              <SelectItem value="light">Light Theme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setLayout(l => l === 'horizontal' ? 'vertical' : 'horizontal')}>
            <Layout className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleCopyCode}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownloadCode}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleShareCode}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Challenges Tabs */}
      <Tabs 
        defaultValue="0" 
        className="w-full"
        onValueChange={handleChallengeChange}
      >
        <TabsList className="mb-4">
          {challenges[language].map((challenge, index) => (
            <TabsTrigger key={index} value={index.toString()} className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              {challenge.title}
              <Badge variant="outline">{challenge.difficulty}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {challenges[language].map((challenge, index) => (
          <TabsContent key={index} value={index.toString()}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{challenge.title}</h3>
                  <p className="text-muted-foreground">{challenge.description}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowTutorial(!showTutorial)}
                  className="flex items-center gap-2"
                >
                  <LightbulbIcon className="h-4 w-4" />
                  {showTutorial ? 'Hide Tutorial' : 'Show Tutorial'}
                </Button>
              </div>

              {showTutorial && (
                <Card className="p-4 bg-secondary/10">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Tutorial Steps:</h4>
                      <ol className="list-decimal pl-4 space-y-2">
                        {challenge.steps.map((step, stepIndex) => (
                          <li key={stepIndex}>
                            <h5 className="font-medium">{step.title}</h5>
                            <p className="text-muted-foreground text-sm">{step.content}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Helpful Hints:</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {challenge.hints.map((hint, hintIndex) => (
                          <li key={hintIndex} className="text-muted-foreground text-sm">
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Editor and Output */}
      <div className={`grid gap-4 ${layout === 'horizontal' ? 'lg:grid-cols-[1.5fr,1fr]' : 'grid-cols-1'}`}>
        <Card className="p-4 min-w-0">
          <Editor
            height="400px"
            language={language}
            theme={theme}
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
              tabSize: 2,
              detectIndentation: true,
              wordWrap: 'on'
            }}
          />
          <div className="flex justify-between mt-4">
            <Button
              onClick={handleRunCode}
              className="flex items-center gap-2"
              variant="default"
            >
              <Play className="h-4 w-4" />
              Run Code
            </Button>
            <Button
              onClick={() => setShowSolution(!showSolution)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LightbulbIcon className="h-4 w-4" />
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Output</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOutput('')}
              className="h-8 px-2"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <pre className="bg-secondary/10 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap min-h-[200px] max-h-[400px] overflow-auto">
            {output || 'Run your code to see the output...'}
            {showSolution && (
              <>
                {'\n\n--- Solution ---\n'}
                {challenges[language][parseInt(activeChallenge)].solution}
              </>
            )}
          </pre>
        </Card>
      </div>
    </div>
  );
};

export default CodePlayground;
