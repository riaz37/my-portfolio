'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Textarea } from '@/components/shared/ui/core/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/core/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shared/ui/core/dialog';
import { Card } from '@/components/shared/ui/data-display/card';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { toast } from 'sonner';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

interface Resource {
  _id: string;
  title: string;
  description: string;
  url: string;
  type: 'video' | 'article' | 'documentation' | 'course' | 'practice';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  tags: string[];
  provider?: string;
  starterCode?: string;
  instructions?: string;
  language?: string;
  solutionCode?: string;
}

export default function ResourcesTab() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    url: '',
    type: 'video' as const,
    level: 'beginner' as const,
    duration: '',
    tags: [] as string[],
    provider: '',
    starterCode: '',
    instructions: '',
    language: '',
    solutionCode: '',
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/admin/learning-paths/resources');
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to fetch resources');
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/learning-paths/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceForm),
      });

      if (!response.ok) throw new Error('Failed to add resource');

      toast.success('Resource added successfully');
      setIsDialogOpen(false);
      setResourceForm({
        title: '',
        description: '',
        url: '',
        type: 'video',
        level: 'beginner',
        duration: '',
        tags: [],
        provider: '',
        starterCode: '',
        instructions: '',
        language: '',
        solutionCode: '',
      });
      fetchResources();
    } catch (error) {
      console.error('Error adding resource:', error);
      toast.error('Failed to add resource');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const response = await fetch(`/api/admin/learning-paths/resources/${resourceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete resource');

      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
  };

  const renderResourceForm = () => {
    const showPracticeFields = resourceForm.type === 'practice';

    return (
      <form onSubmit={handleAddResource} className="space-y-4">
        <Input
          placeholder="Title"
          value={resourceForm.title}
          onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
          required
        />
        <Textarea
          placeholder="Description"
          value={resourceForm.description}
          onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
          required
        />
        <Input
          placeholder="URL"
          type="url"
          value={resourceForm.url}
          onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
          required
        />
        <Select
          value={resourceForm.type}
          onValueChange={(value: Resource['type']) =>
            setResourceForm({ ...resourceForm, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="article">Article</SelectItem>
            <SelectItem value="documentation">Documentation</SelectItem>
            <SelectItem value="course">Course</SelectItem>
            <SelectItem value="practice">Practice</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={resourceForm.level}
          onValueChange={(value: Resource['level']) =>
            setResourceForm({ ...resourceForm, level: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Duration (e.g., '30 mins', '2 hours')"
          value={resourceForm.duration}
          onChange={(e) => setResourceForm({ ...resourceForm, duration: e.target.value })}
        />
        <Input
          placeholder="Provider"
          value={resourceForm.provider}
          onChange={(e) => setResourceForm({ ...resourceForm, provider: e.target.value })}
        />
        <Input
          placeholder="Tags (comma-separated)"
          value={resourceForm.tags.join(', ')}
          onChange={(e) =>
            setResourceForm({
              ...resourceForm,
              tags: e.target.value.split(',').map((tag) => tag.trim()),
            })
          }
        />
        {showPracticeFields && (
          <>
            <Input
              placeholder="Programming Language"
              value={resourceForm.language}
              onChange={(e) => setResourceForm({ ...resourceForm, language: e.target.value })}
            />
            <Textarea
              placeholder="Instructions"
              value={resourceForm.instructions}
              onChange={(e) => setResourceForm({ ...resourceForm, instructions: e.target.value })}
            />
            <Textarea
              placeholder="Starter Code"
              value={resourceForm.starterCode}
              onChange={(e) => setResourceForm({ ...resourceForm, starterCode: e.target.value })}
            />
            <Textarea
              placeholder="Solution Code"
              value={resourceForm.solutionCode}
              onChange={(e) => setResourceForm({ ...resourceForm, solutionCode: e.target.value })}
            />
          </>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Resource'}
        </Button>
      </form>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resources Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FaPlus className="mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Resource</DialogTitle>
            </DialogHeader>
            {renderResourceForm()}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource._id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{resource.title}</h3>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge>{resource.type}</Badge>
                  <Badge>{resource.level}</Badge>
                </div>
                {resource.duration && (
                  <p className="text-sm mt-2">Duration: {resource.duration}</p>
                )}
                {resource.provider && (
                  <p className="text-sm">Provider: {resource.provider}</p>
                )}
                {(resource.tags?.length ?? 0) > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {(resource.tags || []).map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedResource(resource)}
                >
                  <FaEdit className="mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteResource(resource._id)}
                >
                  <FaTrash className="mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
