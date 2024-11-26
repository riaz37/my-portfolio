import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'documentation' | 'video' | 'article' | 'project' | 'tutorial';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt?: Date;
  createdBy?: string;
}

interface UseResourcesOptions {
  type?: string;
  difficulty?: string;
  search?: string;
}

export function useResources(options: UseResourcesOptions = {}) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, [options.type, options.difficulty, options.search]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (options.type) params.append('type', options.type);
      if (options.difficulty) params.append('difficulty', options.difficulty);
      if (options.search) params.append('search', options.search);

      const response = await fetch(`/api/playground/resources?${params}`);
      if (!response.ok) throw new Error('Failed to fetch resources');

      const data = await response.json();
      setResources(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources');
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const addResource = async (resource: Omit<Resource, 'id' | 'createdAt' | 'createdBy'>) => {
    try {
      const response = await fetch('/api/playground/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource),
      });

      if (!response.ok) throw new Error('Failed to add resource');

      const newResource = await response.json();
      setResources(prev => [newResource, ...prev]);
      toast.success('Resource added successfully');
      return newResource;
    } catch (err) {
      console.error('Error adding resource:', err);
      toast.error('Failed to add resource');
      throw err;
    }
  };

  return {
    resources,
    loading,
    error,
    addResource,
    refreshResources: fetchResources,
  };
}
