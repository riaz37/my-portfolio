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
import { useToast } from '@/components/shared/ui/feedback/use-toast';
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
  const { toast } = useToast();

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role' },
    { key: 'company', label: 'Company' },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'featured', label: 'Featured', render: (featured: boolean) => featured ? 'Yes' : 'No' },
    { key: 'order', label: 'Order', sortable: true },
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
        variant: 'destructive',
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
        variant: 'destructive',
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
        variant: 'destructive',
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
        variant: 'destructive',
      });
    }
  }

  function handleEdit(testimonial: Testimonial) {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Loading text="Loading testimonials..." />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTestimonial(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingTestimonial?.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  defaultValue={editingTestimonial?.role}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  defaultValue={editingTestimonial?.company}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={editingTestimonial?.content}
                  required
                />
              </div>
              <div>
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
              <div>
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  name="avatarUrl"
                  defaultValue={editingTestimonial?.avatarUrl}
                  required
                />
              </div>
              <div>
                <Label htmlFor="featured">Featured</Label>
                <select
                  id="featured"
                  name="featured"
                  defaultValue={editingTestimonial?.featured?.toString()}
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
                  defaultValue={editingTestimonial?.order || 0}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingTestimonial ? 'Update' : 'Create'} Testimonial
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={testimonials}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={(key) => {
          if (key === 'order') {
            // For order, we'll handle it differently to update the database
            return;
          }
          const sorted = [...testimonials].sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
          });
          setTestimonials(sorted);
        }}
      />
    </div>
  );
}
