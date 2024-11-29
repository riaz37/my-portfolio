import { useState } from 'react';
import { Button } from '@/components/shared/ui/core/button';
import { Play, AlertCircle, CheckCircle } from 'lucide-react';

import { Alert } from '@/components/shared/ui/feedback/alert';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';



interface TestCase {
  input: any;
  output: string;
}

interface TestResult {
  passed: number;
  failed: number;
  cases: Array<{
    input: any;
    expected: any;
    actual: any;
    passed: boolean;
    error?: string;
  }>;
}

interface CodeRunnerProps {
  code: string;
  language: 'javascript' | 'python';
  testCases: TestCase[];
}

export function CodeRunner({ code, language, testCases }: CodeRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult | null>(null);
  const {toast} = useCustomToast();

  const runCode = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      const response = await fetch('/api/playground/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          testCases,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to execute code');
      }

      const results = await response.json();
      setResults(results);

      if (results.passed === testCases.length) {
        toast({
          title: 'Success',
          description: 'All test cases passed! 🎉',
          variant: 'success'
        });
      } else {
        toast({
          title: 'Error',
          description: `${results.failed} test case(s) failed`,
          variant: 'error'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={runCode}
        disabled={isRunning}
        className="w-full"
      >
        <Play className="w-4 h-4 mr-2" />
        {isRunning ? 'Running...' : 'Run Code'}
      </Button>

      {results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary">
              <div className="text-sm font-medium">Test Cases Passed</div>
              <div className="text-2xl font-bold text-green-500">{results.passed}</div>
            </div>
            <div className="p-4 rounded-lg bg-secondary">
              <div className="text-sm font-medium">Test Cases Failed</div>
              <div className="text-2xl font-bold text-red-500">{results.failed}</div>
            </div>
          </div>

          <div className="space-y-2">
            {results.cases.map((result, index) => (
              <Alert
                key={index}
                variant={result.passed ? 'default' : 'destructive'}
              >
                {result.passed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <div>
                  <div className="font-medium">
                    Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                  </div>
                  <div className="text-sm mt-1">
                    <div>Input: {JSON.stringify(result.input)}</div>
                    <div>Expected: {JSON.stringify(result.expected)}</div>
                    {result.error ? (
                      <div className="text-red-500">Error: {result.error}</div>
                    ) : (
                      <div>Actual: {JSON.stringify(result.actual)}</div>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
