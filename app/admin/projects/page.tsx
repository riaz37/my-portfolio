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
import { useToast } from '@/components/shared/ui/feedback/use-toast';
import { PlusCircle } from 'lucide-react';

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
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'technologies', label: 'Technologies', render: (techs: string[]) => techs.join(', ') },
    { key: 'featured', label: 'Featured', render: (featured: boolean) => featured ? 'Yes' : 'No' },
    { key: 'order', label: 'Order', sortable: true },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const projectData = {
      title: formData.get('title'),
      description: formData.get('description'),
      technologies: formData.get('technologies')?.toString().split(',').map(t => t.trim()),
      imageUrl: formData.get('imageUrl'),
      githubUrl: formData.get('githubUrl'),
      liveUrl: formData.get('liveUrl'),
      featured: formData.get('featured') === 'true',
      order: parseInt(formData.get('order')?.toString() || '0'),
    };

    try {
      const response = await fetch('/api/projects' + (editingProject ? `/${editingProject._id}` : ''), {
        method: editingProject ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject ? { id: editingProject._id, ...projectData } : projectData),
      });

      if (!response.ok) throw new Error('Failed to save project');

      toast({
        title: 'Success',
        description: `Project ${editingProject ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save project',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete(project: Project) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects?id=${project._id}`, {
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
        variant: 'destructive',
      });
    }
  }

  function handleEdit(project: Project) {
    setEditingProject(project);
    setIsDialogOpen(true);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProject(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Project' : 'Add Project'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingProject?.title}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingProject?.description}
                  required
                />
              </div>
              <div>
                <Label htmlFor="technologies">
                  Technologies (comma-separated)
                </Label>
                <Input
                  id="technologies"
                  name="technologies"
                  defaultValue={editingProject?.technologies.join(', ')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={editingProject?.imageUrl}
                  required
                />
              </div>
              <div>
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  defaultValue={editingProject?.githubUrl}
                  required
                />
              </div>
              <div>
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input
                  id="liveUrl"
                  name="liveUrl"
                  defaultValue={editingProject?.liveUrl}
                />
              </div>
              <div>
                <Label htmlFor="featured">Featured</Label>
                <select
                  id="featured"
                  name="featured"
                  defaultValue={editingProject?.featured?.toString()}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  defaultValue={editingProject?.order || 0}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingProject ? 'Update' : 'Create'} Project
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={projects}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={(key) => {
          const sorted = [...projects].sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
          });
          setProjects(sorted);
        }}
      />
    </div>
  );
}
