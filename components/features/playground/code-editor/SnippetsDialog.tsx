'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shared/ui/overlay/dialog';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { ScrollArea } from '@/components/shared/ui/layout/scroll-area';
import { Badge } from '@/components/shared/ui/core/badge';
import { Save, FolderOpen, Loader2 } from 'lucide-react';
import { saveCodeSnippet, getUserSnippets } from '@/lib/services/code-execution';

interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  created_at: string;
}

interface SnippetsDialogProps {
  code: string;
  language: string;
  onLoadSnippet: (code: string, language: string) => void;
}

export function SnippetsDialog({ code, language, onLoadSnippet }: SnippetsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useCustomToast();
  const { data: session } = useSession();

  const handleSave = useCallback(async () => {
    if (!session?.user?.id) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save code snippets.',
        variant: 'destructive',
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your snippet.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      await saveCodeSnippet(session.user.id, code, language, title);
      toast({
        title: 'Success',
        description: 'Code snippet saved successfully!',
      });
      setTitle('');
      await loadSnippets(); // Refresh the list
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save code snippet.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [session?.user?.id, code, language, title, toast]);

  const loadSnippets = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setIsLoading(true);
      const data = await getUserSnippets(session.user.id);
      setSnippets(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load snippets.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, toast]);

  // Load snippets when dialog opens
  useEffect(() => {
    if (isOpen && session?.user?.id) {
      loadSnippets();
    }
  }, [isOpen, session?.user?.id, loadSnippets]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsOpen(true)}
          className="hover:bg-primary/10 transition-colors duration-200"
        >
          <Save className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Code Snippets</DialogTitle>
          <DialogDescription>
            Save and manage your code snippets for future use.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Snippet title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1"
              disabled={isSaving}
            />
            <Button 
              onClick={handleSave} 
              disabled={!title.trim() || isSaving}
              className="min-w-[80px]"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Save'
              )}
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Saved Snippets</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={loadSnippets}
                disabled={isLoading}
                className="hover:bg-primary/10 transition-colors duration-200"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <FolderOpen className="h-4 w-4 mr-2" />
                )}
                Load
              </Button>
            </div>
            <ScrollArea className="h-[200px] rounded-md border">
              {snippets.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  {isLoading ? 'Loading snippets...' : 'No saved snippets yet'}
                </div>
              ) : (
                snippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    className="flex items-center justify-between p-3 hover:bg-accent/50 transition-colors duration-200 cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      onLoadSnippet(snippet.code, snippet.language);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{snippet.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(snippet.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {snippet.language}
                    </Badge>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
