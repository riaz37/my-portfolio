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
import { useToast } from '@/components/shared/ui/feedback/use-toast';
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
  const { toast } = useToast();

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
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingBlog(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? 'Edit Blog' : 'Add Blog'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 py-4">
                <Tabs defaultValue="content">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={editingBlog?.title}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="excerpt" className="text-right">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        name="excerpt"
                        defaultValue={editingBlog?.excerpt}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="content" className="text-right pt-2">Content</Label>
                      <div className="col-span-3">
                        <RichTextEditor
                          content={editingBlog?.content || ''}
                          onChange={(content) => {
                            const textarea = document.querySelector('textarea[name="content"]');
                            if (textarea) {
                              textarea.value = content;
                            }
                          }}
                        />
                        <textarea name="content" defaultValue={editingBlog?.content} hidden />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="metaTitle" className="text-right">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        name="metaTitle"
                        defaultValue={editingBlog?.seo?.metaTitle}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="metaDescription" className="text-right">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        name="metaDescription"
                        defaultValue={editingBlog?.seo?.metaDescription}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="ogImage" className="text-right">OG Image</Label>
                      <Input
                        id="ogImage"
                        name="ogImage"
                        type="url"
                        defaultValue={editingBlog?.seo?.ogImage}
                        className="col-span-3"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="slug" className="text-right">Slug</Label>
                      <Input
                        id="slug"
                        name="slug"
                        defaultValue={editingBlog?.slug}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="categories" className="text-right">Categories</Label>
                      <Input
                        id="categories"
                        name="categories"
                        defaultValue={editingBlog?.categories?.join(', ')}
                        placeholder="Separate with commas"
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tags" className="text-right">Tags</Label>
                      <Input
                        id="tags"
                        name="tags"
                        defaultValue={editingBlog?.tags?.join(', ')}
                        placeholder="Separate with commas"
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="coverImage" className="text-right">Cover Image</Label>
                      <Input
                        id="coverImage"
                        name="coverImage"
                        type="url"
                        defaultValue={editingBlog?.coverImage}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Status</Label>
                      <div className="col-span-3 space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="draft"
                            name="published"
                            value="false"
                            defaultChecked={!editingBlog?.published}
                          />
                          <label htmlFor="draft">Draft</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="published"
                            name="published"
                            value="true"
                            defaultChecked={editingBlog?.published}
                          />
                          <label htmlFor="published">Published</label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Featured</Label>
                      <div className="col-span-3">
                        <input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          defaultChecked={editingBlog?.featured}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="scheduledPublishDate" className="text-right">Schedule Publish</Label>
                      <Input
                        id="scheduledPublishDate"
                        name="scheduledPublishDate"
                        type="datetime-local"
                        defaultValue={editingBlog?.scheduledPublishDate}
                        className="col-span-3"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingBlog ? 'Update Blog' : 'Create Blog'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <DataTable
            data={blogs}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <BlogAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
