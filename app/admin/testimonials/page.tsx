'use client';

import { useState, useEffect } from 'react';
import { Loading } from '@/components/shared/loading';
import { DataTable } from '@/components/features/admin/DataTable';
import { Button } from '@/components/shared/ui/core/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shared/ui/overlay/dialog';
import { Input } from '@/components/shared/ui/core/input';
import { Label } from '@/components/shared/ui/core/label';
import { Textarea } from '@/components/shared/ui/core/textarea';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { PlusCircle } from 'lucide-react';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatarUrl: string;
  featured: boolean;
  order: number;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useCustomToast();

  const columns = [
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true,
      className: 'min-w-[150px]'
    },
    { 
      key: 'role', 
      label: 'Role',
      className: 'hidden sm:table-cell min-w-[120px]'
    },
    { 
      key: 'company', 
      label: 'Company',
      className: 'hidden md:table-cell min-w-[150px]'
    },
    { 
      key: 'rating', 
      label: 'Rating', 
      sortable: true,
      className: 'w-[80px] text-center'
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
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      const response = await fetch('/api/testimonials');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch testimonials',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const testimonialData = {
      name: formData.get('name'),
      role: formData.get('role'),
      company: formData.get('company'),
      content: formData.get('content'),
      rating: parseInt(formData.get('rating')?.toString() || '5'),
      avatarUrl: formData.get('avatarUrl'),
      featured: formData.get('featured') === 'true',
      order: parseInt(formData.get('order')?.toString() || '0'),
    };

    try {
      const response = await fetch('/api/testimonials' + (editingTestimonial ? `/${editingTestimonial._id}` : ''), {
        method: editingTestimonial ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTestimonial ? { id: editingTestimonial._id, ...testimonialData } : testimonialData),
      });

      if (!response.ok) throw new Error('Failed to save testimonial');

      toast({
        title: 'Success',
        description: `Testimonial ${editingTestimonial ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingTestimonial(null);
      fetchTestimonials();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save testimonial',
        variant: 'error',
      });
    }
  }

  async function handleDelete(testimonial: Testimonial) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/testimonials?id=${testimonial._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete testimonial');

      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully',
      });

      fetchTestimonials();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'error',
      });
    }
  }

  async function handleReorder(testimonial: Testimonial, newOrder: number) {
    try {
      const response = await fetch('/api/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: testimonial._id,
          newOrder,
        }),
      });

      if (!response.ok) throw new Error('Failed to reorder testimonial');

      toast({
        title: 'Success',
        description: 'Testimonial reordered successfully',
      });

      fetchTestimonials();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reorder testimonial',
        variant: 'error',
      });
    }
  }

  function handleEdit(testimonial: Testimonial) {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">Manage client testimonials and reviews</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTestimonial(null);
              }}
              className="w-full sm:w-auto"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingTestimonial?.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    name="role"
                    defaultValue={editingTestimonial?.role}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    defaultValue={editingTestimonial?.company}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="1"
                    max="5"
                    defaultValue={editingTestimonial?.rating || 5}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={editingTestimonial?.content}
                  required
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  name="avatarUrl"
                  defaultValue={editingTestimonial?.avatarUrl}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="featured">Featured</Label>
                  <select
                    id="featured"
                    name="featured"
                    defaultValue={editingTestimonial?.featured?.toString()}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    defaultValue={editingTestimonial?.order || 0}
                  />
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={false}>
                  {editingTestimonial ? 'Update' : 'Create'} Testimonial
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Loading text="Loading testimonials..." />
      ) : (
        <div className="bg-card rounded-lg border shadow-sm overflow-x-auto">
          <div className="min-w-full">
            <DataTable
              data={testimonials}
              columns={columns}
              onEdit={(testimonial) => {
                setEditingTestimonial(testimonial);
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
