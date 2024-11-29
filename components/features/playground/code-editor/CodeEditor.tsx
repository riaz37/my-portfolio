'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/shared/ui/core/button';
import { Card } from '@/components/shared/ui/core/card';
import { Icons } from '@/components/shared/icons';
import { cn } from '@/lib/utils';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { executeCode } from '@/lib/services/code-execution';
import { SnippetsDialog } from './SnippetsDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/navigation/tabs';
import { Badge } from '@/components/shared/ui/core/badge';
import { Label } from '@/components/shared/ui/core/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/core/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/shared/ui/navigation/dropdown-menu';
import { Switch } from '@/components/shared/ui/core/switch';
import { Slider } from '@/components/shared/ui/core/slider';

import { Play, Download, Copy, Share2, Settings, Split } from 'lucide-react';

interface CodeEditorProps {
  initialLanguage?: string;
  initialCode?: string;
}

const supportedLanguages = [
  { id: 'javascript', name: 'JavaScript', defaultCode: '// Write your JavaScript code here\n\nconsole.log("Hello World!");' },
  { id: 'python', name: 'Python', defaultCode: '# Write your Python code here\n\nprint("Hello World!")' },
  { id: 'html', name: 'HTML', defaultCode: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>' },
  { id: 'css', name: 'CSS', defaultCode: '/* Write your CSS code here */\n\nbody {\n  margin: 0;\n  padding: 20px;\n  font-family: sans-serif;\n}' },
];

export function CodeEditor({ initialLanguage = 'javascript', initialCode }: CodeEditorProps) {
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode || supportedLanguages.find(lang => lang.id === initialLanguage)?.defaultCode || '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [autoRun, setAutoRun] = useState(false);
  const [splitView, setSplitView] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const { toast } = useCustomToast();

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const defaultCode = supportedLanguages.find(lang => lang.id === newLang)?.defaultCode;
    if (!code || code === supportedLanguages.find(lang => lang.id === language)?.defaultCode) {
      setCode(defaultCode || '');
    }
  };

  const runCode = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setError('');
    setOutput('');
    
    try {
      const result = await executeCode(code, language);
      if (result.error) {
        setError(result.error);
        toast({
          title: 'Error executing code',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        setOutput(result.stdout || result.output || '');
        if (result.stdout || result.output) {
          toast({
            title: 'Code executed successfully',
            description: 'Check the output panel for results',
          });
        }
      }
    } catch (err) {
      console.error('Error executing code:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while executing the code';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, language, isRunning, toast]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (autoRun && !isRunning) {
      timeoutId = setTimeout(runCode, 1000);
    }
    return () => clearTimeout(timeoutId);
  }, [code, autoRun, runCode, isRunning]);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code);
    toast({
      title: 'Code copied!',
      description: 'The code has been copied to your clipboard.',
      duration: 2000,
    });
  };

  const handleDownload = () => {
    const fileExtensions: { [key: string]: string } = {
      javascript: 'js',
      python: 'py',
      html: 'html',
      css: 'css',
    };
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${fileExtensions[language]}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Share Code',
        text: code,
      });
    } catch (error) {
      handleCopyCode();
    }
  };

  return (
    <div className={`grid ${splitView ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Switch
                  id="auto-run"
                  checked={autoRun}
                  onCheckedChange={setAutoRun}
                />
                <Label htmlFor="auto-run">Auto-run</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFontSize(fontSize - 1)}>
                    Decrease Font Size
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFontSize(fontSize + 1)}>
                    Increase Font Size
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSplitView(!splitView)}>
                    Toggle Split View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon" onClick={() => setSplitView(!splitView)}>
                <Split className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleCopyCode}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <SnippetsDialog
                code={code}
                language={language}
                onLoadSnippet={(newCode, newLang) => {
                  setCode(newCode);
                  setLanguage(newLang);
                }}
              />
              <Button onClick={runCode} disabled={isRunning}>
                {isRunning ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="h-[600px] border rounded-md overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage={language}
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: fontSize,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </Card>

      {(splitView || output || error) && (
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 space-y-4">
            <Tabs defaultValue={error ? 'error' : 'output'}>
              <TabsList>
                <TabsTrigger value="output" disabled={!output}>
                  Output
                  {output && <Badge variant="secondary" className="ml-2">1</Badge>}
                </TabsTrigger>
                <TabsTrigger value="error" disabled={!error}>
                  Error
                  {error && <Badge variant="destructive" className="ml-2">1</Badge>}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="output">
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[600px] whitespace-pre-wrap">
                  {output || 'No output'}
                </pre>
              </TabsContent>
              <TabsContent value="error">
                <pre className="bg-destructive/10 text-destructive p-4 rounded-md overflow-auto max-h-[600px] whitespace-pre-wrap">
                  {error || 'No errors'}
                </pre>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      )}
    </div>
  );
}
