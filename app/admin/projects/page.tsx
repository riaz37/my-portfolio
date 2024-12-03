'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/features/admin/DataTable';
import { Button } from '@/components/shared/ui/core/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/shared/ui/overlay/dialog';
import { Input } from '@/components/shared/ui/core/input';
import { Label } from '@/components/shared/ui/core/label';
import { Textarea } from '@/components/shared/ui/core/textarea';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { PlusCircle } from 'lucide-react';
import { Loading } from '@/components/shared/loading';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  order: number;
  isDeleted: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useCustomToast();

  const columns = [
    { 
      key: 'title', 
      label: 'Title', 
      sortable: true,
      className: 'min-w-[200px]'
    },
    { 
      key: 'technologies', 
      label: 'Technologies', 
      render: (techs: string[]) => techs.join(', '),
      className: 'hidden md:table-cell min-w-[200px]'
    },
    { 
      key: 'featured', 
      label: 'Featured', 
      render: (featured: boolean) => featured ? 'Yes' : 'No',
      className: 'w-[100px] text-center'
    },
    { 
      key: 'order', 
      label: 'Order', 
      sortable: true,
      className: 'w-[80px] text-center'
    },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const response = await fetch('/api/admin/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      // Validate required fields
      const requiredFields = ['title', 'description', 'technologies', 'imageUrl', 'githubUrl'];
      for (const field of requiredFields) {
        const value = formData.get(field)?.toString().trim();
        if (!value) {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
      }

      const projectData = {
        title: formData.get('title')?.toString().trim(),
        description: formData.get('description')?.toString().trim(),
        technologies: formData.get('technologies')?.toString().split(',').map(t => t.trim()).filter(t => t),
        imageUrl: formData.get('imageUrl')?.toString().trim(),
        githubUrl: formData.get('githubUrl')?.toString().trim(),
        liveUrl: formData.get('liveUrl')?.toString().trim() || '',
        featured: formData.get('featured') === 'true',
        order: parseInt(formData.get('order')?.toString() || '0'),
        isDeleted: false,
      };

      // Construct the fetch URL and method
      const url = editingProject 
        ? `/api/admin/projects/${editingProject._id}` 
        : '/api/admin/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      // Parse response data
      const data = await response.json();

      // Check response status
      if (!response.ok) {
        // If response is not ok, throw an error with details
        const errorMessage = data.error || data.details?.map((err: any) => err.message).join(', ') || 'Failed to save project';
        throw new Error(errorMessage);
      }

      // Success toast
      toast({
        title: 'Success',
        description: `Project ${editingProject ? 'updated' : 'created'} successfully`,
        variant: 'success', // Added success variant
      });

      // Reset form and state
      setIsDialogOpen(false);
      setEditingProject(null);
      
      // Refresh projects list
      fetchProjects();
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Error toast with detailed message
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save project',
        variant: 'error',
      });
    }
  }

  async function handleDelete(project: Project) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/admin/projects?id=${project._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });

      fetchProjects();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'error',
      });
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      const imageUrlInput = document.querySelector('input[name="imageUrl"]') as HTMLInputElement;
      if (imageUrlInput) {
        imageUrlInput.value = data.url;
      }

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'error',
      });
    }
  }

  function handleEdit(project: Project) {
    setEditingProject(project);
    setIsDialogOpen(true);
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingProject(null);
              }}
              className="w-full sm:w-auto"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
              <DialogDescription>
                Add details about your project
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingProject?.title}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingProject?.description}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies * (comma-separated)</Label>
                  <Input
                    id="technologies"
                    name="technologies"
                    defaultValue={editingProject?.technologies?.join(', ')}
                    required
                    placeholder="React, TypeScript, Next.js"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUpload">Project Image *</Label>
                <div className="flex items-center gap-4">
                  {editingProject?.imageUrl && (
                    <div className="relative w-24 h-24">
                      <img
                        src={editingProject.imageUrl}
                        alt={editingProject.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <Input
                      id="imageUpload"
                      name="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground">
                      Or provide an image URL: *
                    </p>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      defaultValue={editingProject?.imageUrl}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL *</Label>
                  <Input
                    id="githubUrl"
                    name="githubUrl"
                    type="url"
                    defaultValue={editingProject?.githubUrl}
                    required
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liveUrl">Live URL</Label>
                  <Input
                    id="liveUrl"
                    name="liveUrl"
                    type="url"
                    defaultValue={editingProject?.liveUrl}
                    placeholder="https://your-project.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    defaultValue={editingProject?.order || 0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featured">Featured Project</Label>
                  <select
                    id="featured"
                    name="featured"
                    defaultValue={editingProject?.featured?.toString()}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProject ? 'Update' : 'Create'} Project
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Loading text="Loading projects..." />
      ) : (
        <div className="bg-card rounded-lg border shadow-sm overflow-x-auto">
          <div className="min-w-full">
            <DataTable
              data={projects}
              columns={columns}
              onEdit={(project) => {
                setEditingProject(project);
                setIsDialogOpen(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
}
