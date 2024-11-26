'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Textarea } from '@/components/shared/ui/core/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/core/select';
import { Card } from '@/components/shared/ui/data-display/card';
import { Plus, Edit, Trash } from 'lucide-react';

interface Step {
  title: string;
  content: string;
}

interface Challenge {
  _id: string;
  title: string;
  category: string;
  language: 'javascript' | 'python';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  steps: Step[];
  hints: string[];
  code: string;
  solution: string;
}

export default function ChallengesAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Partial<Challenge>>({
    steps: [],
    hints: [],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'admin') {
      router.push('/');
    } else {
      fetchChallenges();
    }
  }, [status, session]);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges');
      const data = await response.json();
      setChallenges(data);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing && currentChallenge._id 
        ? `/api/challenges/${currentChallenge._id}`
        : '/api/challenges';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentChallenge),
      });

      if (!response.ok) throw new Error('Failed to save challenge');

      fetchChallenges();
      resetForm();
    } catch (error) {
      console.error('Failed to save challenge:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;

    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete challenge');

      fetchChallenges();
    } catch (error) {
      console.error('Failed to delete challenge:', error);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentChallenge({ steps: [], hints: [] });
  };

  const addStep = () => {
    setCurrentChallenge(prev => ({
      ...prev,
      steps: [...(prev.steps || []), { title: '', content: '' }],
    }));
  };

  const updateStep = (index: number, field: keyof Step, value: string) => {
    setCurrentChallenge(prev => {
      const newSteps = [...(prev.steps || [])];
      newSteps[index] = { ...newSteps[index], [field]: value };
      return { ...prev, steps: newSteps };
    });
  };

  const removeStep = (index: number) => {
    setCurrentChallenge(prev => ({
      ...prev,
      steps: (prev.steps || []).filter((_, i) => i !== index),
    }));
  };

  const addHint = () => {
    setCurrentChallenge(prev => ({
      ...prev,
      hints: [...(prev.hints || []), ''],
    }));
  };

  const updateHint = (index: number, value: string) => {
    setCurrentChallenge(prev => {
      const newHints = [...(prev.hints || [])];
      newHints[index] = value;
      return { ...prev, hints: newHints };
    });
  };

  const removeHint = (index: number) => {
    setCurrentChallenge(prev => ({
      ...prev,
      hints: (prev.hints || []).filter((_, i) => i !== index),
    }));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Coding Challenges</h1>

      {/* Challenge Form */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? 'Edit Challenge' : 'Add New Challenge'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Title"
              value={currentChallenge.title || ''}
              onChange={e => setCurrentChallenge(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <Input
              placeholder="Category"
              value={currentChallenge.category || ''}
              onChange={e => setCurrentChallenge(prev => ({ ...prev, category: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              value={currentChallenge.language}
              onValueChange={value => setCurrentChallenge(prev => ({ ...prev, language: value as 'javascript' | 'python' }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={currentChallenge.difficulty}
              onValueChange={value => setCurrentChallenge(prev => ({ ...prev, difficulty: value as 'Beginner' | 'Intermediate' | 'Advanced' }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Description"
            value={currentChallenge.description || ''}
            onChange={e => setCurrentChallenge(prev => ({ ...prev, description: e.target.value }))}
            required
          />

          {/* Steps */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Steps</h3>
              <Button type="button" variant="outline" size="sm" onClick={addStep}>
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>
            {currentChallenge.steps?.map((step, index) => (
              <div key={index} className="grid grid-cols-1 gap-2 p-4 border rounded-lg">
                <Input
                  placeholder="Step Title"
                  value={step.title}
                  onChange={e => updateStep(index, 'title', e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Step Content"
                  value={step.content}
                  onChange={e => updateStep(index, 'content', e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeStep(index)}
                >
                  Remove Step
                </Button>
              </div>
            ))}
          </div>

          {/* Hints */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Hints</h3>
              <Button type="button" variant="outline" size="sm" onClick={addHint}>
                <Plus className="h-4 w-4 mr-2" />
                Add Hint
              </Button>
            </div>
            {currentChallenge.hints?.map((hint, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Hint"
                  value={hint}
                  onChange={e => updateHint(index, e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeHint(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Textarea
            placeholder="Initial Code"
            value={currentChallenge.code || ''}
            onChange={e => setCurrentChallenge(prev => ({ ...prev, code: e.target.value }))}
            required
            className="font-mono"
          />

          <Textarea
            placeholder="Solution"
            value={currentChallenge.solution || ''}
            onChange={e => setCurrentChallenge(prev => ({ ...prev, solution: e.target.value }))}
            required
            className="font-mono"
          />

          <div className="flex gap-2">
            <Button type="submit">
              {isEditing ? 'Update Challenge' : 'Create Challenge'}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Challenges List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-6">Existing Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map(challenge => (
            <Card key={challenge._id} className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-medium truncate">{challenge.title}</h3>
                <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{challenge.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="bg-blue-50">{challenge.language}</Badge>
                  <Badge variant="outline" className="bg-green-50">{challenge.difficulty}</Badge>
                  <Badge variant="outline" className="bg-purple-50">{challenge.category}</Badge>
                </div>
              </div>
              <div className="flex gap-2 mt-4 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentChallenge(challenge);
                    setIsEditing(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(challenge._id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
