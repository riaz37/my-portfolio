'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Textarea } from '@/components/shared/ui/core/textarea';
import { Plus, Edit, Trash } from 'lucide-react';
import { Loading } from '@/components/shared/loading';
import { Card } from '@/components/shared/ui/core/card';
import { Badge } from '@/components/shared/ui/core/badge';

interface CommunityProject {
  _id: string;
  name: string;
  description: string;
  stars: string;
  forks: string;
  contributors: string[];
  repoUrl: string;
  demoUrl?: string;
  technologies: string[];
}

export default function CommunityProjectsAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState<Partial<CommunityProject>>({
    contributors: [],
    technologies: [],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'admin') {
      router.push('/');
    } else {
      fetchProjects();
    }
  }, [status, session]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/community-projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing && currentProject._id 
        ? `/api/community-projects/${currentProject._id}`
        : '/api/community-projects';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentProject),
      });

      if (!response.ok) throw new Error('Failed to save project');

      fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/community-projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');

      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProject({ contributors: [], technologies: [] });
  };

  const addContributor = () => {
    setCurrentProject(prev => ({
      ...prev,
      contributors: [...(prev.contributors || []), ''],
    }));
  };

  const updateContributor = (index: number, value: string) => {
    setCurrentProject(prev => {
      const newContributors = [...(prev.contributors || [])];
      newContributors[index] = value;
      return { ...prev, contributors: newContributors };
    });
  };

  const removeContributor = (index: number) => {
    setCurrentProject(prev => ({
      ...prev,
      contributors: (prev.contributors || []).filter((_, i) => i !== index),
    }));
  };

  const addTechnology = () => {
    setCurrentProject(prev => ({
      ...prev,
      technologies: [...(prev.technologies || []), ''],
    }));
  };

  const updateTechnology = (index: number, value: string) => {
    setCurrentProject(prev => {
      const newTechnologies = [...(prev.technologies || [])];
      newTechnologies[index] = value;
      return { ...prev, technologies: newTechnologies };
    });
  };

  const removeTechnology = (index: number) => {
    setCurrentProject(prev => ({
      ...prev,
      technologies: (prev.technologies || []).filter((_, i) => i !== index),
    }));
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Community Projects Management</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block mb-2">Project Name</label>
          <Input
            value={currentProject.name || ''}
            onChange={(e) => setCurrentProject(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <Textarea
            value={currentProject.description || ''}
            onChange={(e) => setCurrentProject(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block mb-2">Repository URL</label>
          <Input
            type="url"
            value={currentProject.repoUrl || ''}
            onChange={(e) => setCurrentProject(prev => ({ ...prev, repoUrl: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block mb-2">Demo URL (Optional)</label>
          <Input
            type="url"
            value={currentProject.demoUrl || ''}
            onChange={(e) => setCurrentProject(prev => ({ ...prev, demoUrl: e.target.value }))}
          />
        </div>

        <div>
          <label className="block mb-2">Stars</label>
          <Input
            value={currentProject.stars || '0'}
            onChange={(e) => setCurrentProject(prev => ({ ...prev, stars: e.target.value }))}
          />
        </div>

        <div>
          <label className="block mb-2">Forks</label>
          <Input
            value={currentProject.forks || '0'}
            onChange={(e) => setCurrentProject(prev => ({ ...prev, forks: e.target.value }))}
          />
        </div>

        <div>
          <label className="block mb-2">Contributors</label>
          {currentProject.contributors?.map((contributor, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={contributor}
                onChange={(e) => updateContributor(index, e.target.value)}
                placeholder="Contributor username"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeContributor(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addContributor} variant="outline">
            <Plus className="h-4 w-4 mr-2" /> Add Contributor
          </Button>
        </div>

        <div>
          <label className="block mb-2">Technologies</label>
          {currentProject.technologies?.map((tech, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={tech}
                onChange={(e) => updateTechnology(index, e.target.value)}
                placeholder="Technology name"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeTechnology(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addTechnology} variant="outline">
            <Plus className="h-4 w-4 mr-2" /> Add Technology
          </Button>
        </div>

        <div className="flex gap-2">
          <Button type="submit">
            {isEditing ? 'Update Project' : 'Create Project'}
          </Button>
          {isEditing && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project._id} className="p-4">
            <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{project.description}</p>
            
            <div className="flex gap-2 mb-2">
              <Badge variant="secondary">⭐ {project.stars}</Badge>
              <Badge variant="secondary">🍴 {project.forks}</Badge>
            </div>

            <div className="mb-2">
              <p className="text-sm font-medium">Technologies:</p>
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech, index) => (
                  <Badge key={index}>{tech}</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentProject(project);
                  setIsEditing(true);
                }}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(project._id)}
              >
                <Trash className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
