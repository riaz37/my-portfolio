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
import { CareerPath } from '@/types/learningPath';

export default function CareerPathsTab() {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<CareerPath | null>(null);
  const { toast } = useCustomToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchCareerPaths();
  }, []);

  const fetchCareerPaths = async () => {
    try {
      const response = await fetch('/api/career-paths');
      if (!response.ok) throw new Error('Failed to fetch career paths');
      const data = await response.json();
      setCareerPaths(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load career paths',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/career-paths', {
        method: editingPath ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPath ? { ...formData, id: editingPath._id } : formData),
      });

      if (!response.ok) throw new Error('Failed to save career path');
      
      toast({
        title: 'Success',
        description: `Career path ${editingPath ? 'updated' : 'created'} successfully`,
      });
      
      setIsDialogOpen(false);
      setEditingPath(null);
      setFormData({ title: '', description: '' });
      fetchCareerPaths();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save career path',
        variant: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career path?')) return;
    
    try {
      const response = await fetch(`/api/career-paths?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete career path');
      
      toast({
        title: 'Success',
        description: 'Career path deleted successfully',
      });
      
      fetchCareerPaths();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete career path',
        variant: 'error',
      });
    }
  };

  const handleEdit = (path: CareerPath) => {
    setEditingPath(path);
    setFormData({
      title: path.title,
      description: path.description,
    });
    setIsDialogOpen(true);
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Career Paths</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPath(null);
                setFormData({ title: '', description: '' });
              }}
            >
              <FaPlus className="mr-2" /> Add Career Path
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPath ? 'Edit Career Path' : 'Add Career Path'}</DialogTitle>
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
              <Button type="submit">{editingPath ? 'Update' : 'Create'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {careerPaths.map((path) => (
          <Card key={path._id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{path.title}</h3>
                <p className="text-sm text-gray-600">{path.description}</p>
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
