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
  DialogFooter,
} from '@/components/shared/ui/overlay/dialog';
import { Input } from '@/components/shared/ui/core/input';
import { Label } from '@/components/shared/ui/core/label';
import { Textarea } from '@/components/shared/ui/core/textarea';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { PlusCircle } from 'lucide-react';
import { Loading } from '@/components/shared/loading';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shared/ui/core/tabs';
import RichTextEditor from '@/components/features/admin/RichTextEditor';
import BlogAnalytics from '@/components/features/admin/BlogAnalytics';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  categories: string[];
  published: boolean;
  featured: boolean;
  scheduledPublishDate?: string;
  views: number;
  likes: number;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  };
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const { toast } = useCustomToast();

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'authorEmail', label: 'Author' },
    { key: 'tags', label: 'Tags', render: (tags: string[]) => tags.join(', ') },
    { key: 'published', label: 'Published', render: (published: boolean) => published ? 'Yes' : 'No' },
    { key: 'views', label: 'Views', sortable: true },
    { key: 'likes', label: 'Likes', sortable: true },
    { 
      key: 'createdAt', 
      label: 'Created', 
      render: (date: string) => new Date(date).toLocaleDateString() 
    },
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      const response = await fetch('/api/admin/blogs');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch blogs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const blogData = {
        title: formData.get('title')?.toString().trim() || '',
        content: formData.get('content')?.toString().trim() || '',
        excerpt: formData.get('excerpt')?.toString().trim() || '',
        coverImage: formData.get('coverImage')?.toString().trim() || '',
        tags: formData.get('tags')?.toString().split(',').map(t => t.trim()).filter(Boolean) || [],
        categories: formData.get('categories')?.toString().split(',').map(t => t.trim()).filter(Boolean) || [],
        published: formData.get('published') === 'true',
        featured: formData.get('featured') === 'true',
        scheduledPublishDate: formData.get('scheduledPublishDate')?.toString().trim() || '',
        seo: {
          metaTitle: formData.get('metaTitle')?.toString().trim() || '',
          metaDescription: formData.get('metaDescription')?.toString().trim() || '',
          ogImage: formData.get('ogImage')?.toString().trim() || '',
        },
      };

      if (!blogData.title || !blogData.content || !blogData.excerpt) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        editingBlog ? `/api/admin/blogs/${editingBlog._id}` : '/api/admin/blogs',
        {
          method: editingBlog ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(blogData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save blog');
      }

      toast({
        title: 'Success',
        description: `Blog ${editingBlog ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingBlog(null);
      await fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save blog',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(blog: Blog) {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const response = await fetch(`/api/admin/blogs/${blog._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete blog');
      }

      toast({
        title: 'Success',
        description: 'Blog deleted successfully',
      });

      await fetchBlogs();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete blog',
        variant: 'destructive',
      });
    }
  }

  function handleEdit(blog: Blog) {
    setEditingBlog(blog);
    setIsDialogOpen(true);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingBlog(null);
              }}
              className="w-full sm:w-auto"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={editingBlog?.title}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      defaultValue={editingBlog?.slug}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    defaultValue={editingBlog?.excerpt}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    className="min-h-[300px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <Input
                      id="coverImage"
                      name="coverImage"
                      defaultValue={editingBlog?.coverImage}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledPublishDate">Scheduled Publish Date</Label>
                    <Input
                      id="scheduledPublishDate"
                      name="scheduledPublishDate"
                      type="datetime-local"
                      defaultValue={editingBlog?.scheduledPublishDate}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      name="tags"
                      defaultValue={editingBlog?.tags.join(', ')}
                      placeholder="tech, programming, web development"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categories">Categories (comma-separated)</Label>
                    <Input
                      id="categories"
                      name="categories"
                      defaultValue={editingBlog?.categories.join(', ')}
                      placeholder="Tutorial, Guide, Opinion"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="published">Status</Label>
                    <select
                      id="published"
                      name="published"
                      defaultValue={editingBlog?.published?.toString()}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="true">Published</option>
                      <option value="false">Draft</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="featured">Featured</Label>
                    <select
                      id="featured"
                      name="featured"
                      defaultValue={editingBlog?.featured?.toString()}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authorEmail">Author Email</Label>
                    <Input
                      id="authorEmail"
                      name="authorEmail"
                      type="email"
                      defaultValue={editingBlog?.authorEmail}
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    defaultValue={editingBlog?.seo?.metaTitle}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    defaultValue={editingBlog?.seo?.metaDescription}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <Input
                    id="ogImage"
                    name="ogImage"
                    defaultValue={editingBlog?.seo?.ogImage}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <Loading className="mr-2" />
                  ) : null}
                  {editingBlog ? 'Update' : 'Create'} Blog Post
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Loading text="Loading blog posts..." />
      ) : (
        <div className="space-y-6">
          <BlogAnalytics />
          <div className="bg-card rounded-lg border shadow-sm">
            <DataTable
              data={blogs}
              columns={columns}
              onEdit={(blog) => {
                setEditingBlog(blog);
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
