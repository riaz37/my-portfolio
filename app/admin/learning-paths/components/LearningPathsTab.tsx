'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Textarea } from '@/components/shared/ui/core/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shared/ui/overlay/dialog';
import { Card } from '@/components/shared/ui/core/card';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Loading } from '@/components/shared/loading';
import { LearningPath } from '@/types/learningPath';

export default function LearningPathsTab() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
  const { toast } = useCustomToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    prerequisites: '',
  });

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      const response = await fetch('/api/learning-paths');
      if (!response.ok) throw new Error('Failed to fetch learning paths');
      const data = await response.json();
      setLearningPaths(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load learning paths',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/learning-paths', {
        method: editingPath ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPath ? { ...formData, id: editingPath._id } : formData),
      });

      if (!response.ok) throw new Error('Failed to save learning path');
      
      toast({
        title: 'Success',
        description: `Learning path ${editingPath ? 'updated' : 'created'} successfully`,
        variant: 'success',
      });
      
      setIsDialogOpen(false);
      setEditingPath(null);
      setFormData({ title: '', description: '', duration: '', prerequisites: '' });
      fetchLearningPaths();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save learning path',
        variant: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this learning path?')) return;
    
    try {
      const response = await fetch(`/api/learning-paths?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete learning path');
      
      toast({
        title: 'Success',
        description: 'Learning path deleted successfully',
        variant: 'success',
      });
      
      fetchLearningPaths();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete learning path',
        variant: 'error',
      });
    }
  };

  const handleEdit = (path: LearningPath) => {
    setEditingPath(path);
    setFormData({
      title: path.title,
      description: path.description,
      duration: path.duration,
      prerequisites: path.prerequisites,
    });
    setIsDialogOpen(true);
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Learning Paths</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPath(null);
                setFormData({ title: '', description: '', duration: '', prerequisites: '' });
              }}
            >
              <FaPlus className="mr-2" /> Add Learning Path
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPath ? 'Edit Learning Path' : 'Add Learning Path'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Duration (e.g., '4 weeks')"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Prerequisites"
                  value={formData.prerequisites}
                  onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">{editingPath ? 'Update' : 'Create'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {learningPaths.map((path) => (
          <Card key={path._id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{path.title}</h3>
                <p className="text-sm text-gray-600">{path.description}</p>
                <div className="mt-2">
                  <p className="text-sm"><strong>Duration:</strong> {path.duration}</p>
                  <p className="text-sm"><strong>Prerequisites:</strong> {path.prerequisites}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(path)}>
                  <FaEdit />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(path._id)}>
                  <FaTrash />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
