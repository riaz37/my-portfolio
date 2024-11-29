'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Terminal as TerminalIcon, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createCommands } from '@/lib/features/commands';
import { useTerminal } from '@/providers/TerminalProvider';

interface Command {
  command: string;
  args?: string[];
}

function Terminal() {
  const WELCOME_MESSAGE = 'Welcome to the terminal! Type "help" to see available commands.';
  
  const { isOpen, toggleTerminal } = useTerminal();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([WELCOME_MESSAGE]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const commands = createCommands(router);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl + /
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        toggleTerminal();
      }
      // Check for Escape when terminal is open
      else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        toggleTerminal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleTerminal]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const parseCommand = (input: string): Command => {
    const parts = input.trim().split(' ');
    return {
      command: parts[0].toLowerCase(),
      args: parts.slice(1)
    };
  };

  const executeCommand = (input: string) => {
    if (!input.trim()) return;

    const { command, args } = parseCommand(input);
    setHistory(prev => [...prev, `> ${input}`]);
    
    // Special case for clear command
    if (command === 'clear') {
      setHistory([WELCOME_MESSAGE]);
      return;
    }
    
    const cmd = commands.find(c => c.command === command);
    if (cmd) {
      const output = cmd.action(args);
      setHistory(prev => [...prev, ...output]);
    } else {
      setHistory(prev => [...prev, `Command not found: ${command}`]);
    }

    // Ensure scroll to bottom after command execution
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, 0);

    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentInput = input.toLowerCase();
      const matches = commands
        .map(c => c.command)
        .filter(c => c.startsWith(currentInput));
      
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    }
  };

  return (
    <>
      {/* Floating Toggle Button - Hidden on Mobile */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={toggleTerminal}
        className={cn(
          "fixed left-4 bottom-4 z-50 p-3 rounded-xl",
          "bg-background/80 shadow-lg backdrop-blur border border-border/50",
          "hover:bg-background/90 hover:shadow-xl transition-all duration-200",
          "flex items-center gap-2 text-sm text-muted-foreground",
          "group",
          "hidden md:flex", // Hide on mobile, show on desktop
          isOpen && "hidden"
        )}
      >
        <TerminalIcon className="h-4 w-4 text-primary group-hover:text-primary/80" />
        <span className="inline-flex items-center gap-2">
          Terminal
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">Ctrl + /</kbd>
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed hidden md:block left-4 bottom-0 z-50 w-full md:bottom-4 md:w-[500px] md:left-4 p-4" // Hide on mobile
          >
            <div
              ref={terminalRef}
              className={cn(
                "flex h-[400px] flex-col rounded-xl border bg-black/80 shadow-2xl",
                "backdrop-blur-xl backdrop-saturate-200 supports-[backdrop-filter]:bg-background/40",
                "transition-all duration-200 ease-in-out hover:shadow-primary/5"
              )}
            >
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-border/50 bg-background/50 px-4 py-2 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="ml-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <TerminalIcon className="h-4 w-4" />
                    <span className="font-medium">Terminal</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">Ctrl + /</kbd>
                    <span>to toggle</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTerminal}
                    className="h-6 w-6 rounded-full hover:bg-background/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Terminal Content */}
              <ScrollArea ref={outputRef} className="flex-1 p-4 font-mono text-sm text-foreground/90">
                {history.map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
              </ScrollArea>

              {/* Input Line */}
              <div className="flex items-center gap-2 border-t border-border/50 bg-background/50 px-4 py-2 rounded-b-xl">
                <ChevronRight className="h-4 w-4 text-primary" />
                <Input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none"
                  placeholder="Type a command..."
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Terminal;