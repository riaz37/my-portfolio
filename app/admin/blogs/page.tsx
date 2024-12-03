'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/features/admin/DataTable';
import {
  Button,
  Input,
  Label,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/shared/ui';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { PlusCircle } from 'lucide-react';
import { Loading } from '@/components/shared/ui/feedback/loading';
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
  author: {
    name: string;
    email: string;
  };
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const { toast } = useCustomToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: '',
    categories: '',
    isPublished: false,
    featured: false,
    scheduledPublishDate: '',
    authorName: '',
    authorEmail: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      ogImage: '',
    }
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        tags: '',
        categories: '',
        isPublished: false,
        featured: false,
        scheduledPublishDate: '',
        authorName: '',
        authorEmail: '',
        seo: {
          metaTitle: '',
          metaDescription: '',
          ogImage: '',
        }
      });
      setEditingBlog(null);
      setActiveTab('content');
    }
  }, [isDialogOpen]);

  // Update form data when editing blog changes
  useEffect(() => {
    if (editingBlog) {
      setFormData({
        title: editingBlog.title || '',
        slug: editingBlog.slug || '',
        excerpt: editingBlog.excerpt || '',
        content: editingBlog.content || '',
        coverImage: editingBlog.coverImage || '',
        tags: editingBlog.tags?.join(', ') || '',
        categories: editingBlog.categories?.join(', ') || '',
        isPublished: editingBlog.published || false,
        featured: editingBlog.featured || false,
        scheduledPublishDate: editingBlog.scheduledPublishDate || '',
        authorName: editingBlog.author?.name || '',
        authorEmail: editingBlog.author?.email || '',
        seo: {
          metaTitle: editingBlog.seo?.metaTitle || '',
          metaDescription: editingBlog.seo?.metaDescription || '',
          ogImage: editingBlog.seo?.ogImage || '',
        }
      });
    }
  }, [editingBlog]);

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle content change from rich text editor
  const handleContentChange = (newContent: string) => {
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

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

  async function fetchBlogs() {
    try {
      const response = await fetch('/api/admin/blogs');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error fetching blogs',
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!formData.title || !formData.content || !formData.excerpt || !formData.authorName || !formData.authorEmail) {
        toast({
          variant: 'destructive',
          title: 'Missing required fields',
          description: 'Please fill in all required fields before submitting.'
        });
        setIsLoading(false);
        return;
      }

      const slug = formData.slug || 
                  formData.title.toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '');

      const blogData = {
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: formData.coverImage,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        categories: formData.categories.split(',').map(t => t.trim()).filter(Boolean),
        published: formData.isPublished,
        featured: formData.featured,
        scheduledPublishDate: formData.scheduledPublishDate || undefined,
        author: {
          name: formData.authorName,
          email: formData.authorEmail,
        },
        seo: formData.seo,
      };

      const response = await fetch(
        editingBlog ? `/api/admin/blogs/${editingBlog._id}` : '/api/admin/blogs',
        {
          method: editingBlog ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(blogData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save blog');
      }

      await fetchBlogs();
      setIsDialogOpen(false);
      toast({
        variant: 'default',
        title: 'Success',
        description: `Blog post ${editingBlog ? 'updated' : 'created'} successfully!`,
      });

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error saving blog',
        description: error instanceof Error ? error.message : 'Something went wrong'
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
        throw new Error(error.message || 'Failed to delete blog');
      }

      await fetchBlogs();
      toast({
        variant: 'default',
        title: 'Success',
        description: 'Blog post deleted successfully!'
      });

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error deleting blog',
        description: error instanceof Error ? error.message : 'Something went wrong'
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBlog ? 'Edit' : 'Create'} Blog Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <Tabs defaultValue="content" className="w-full" onValueChange={setActiveTab} value={activeTab}>
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
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          placeholder="Leave empty to generate from title"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <RichTextEditor
                        content={formData.content}
                        onChange={handleContentChange}
                        className="min-h-[300px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="coverImage">Cover Image URL</Label>
                        <Input
                          id="coverImage"
                          name="coverImage"
                          value={formData.coverImage}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="scheduledPublishDate">Scheduled Publish Date</Label>
                        <Input
                          id="scheduledPublishDate"
                          name="scheduledPublishDate"
                          type="datetime-local"
                          value={formData.scheduledPublishDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          name="tags"
                          value={formData.tags}
                          onChange={handleInputChange}
                          placeholder="tech, programming, web development"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categories">Categories (comma-separated)</Label>
                        <Input
                          id="categories"
                          name="categories"
                          value={formData.categories}
                          onChange={handleInputChange}
                          placeholder="Tutorial, Guide, Opinion"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="published">Status</Label>
                        <select
                          id="published"
                          name="isPublished"
                          value={formData.isPublished.toString()}
                          onChange={handleInputChange}
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
                          value={formData.featured.toString()}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="authorName">Author Name</Label>
                        <Input
                          id="authorName"
                          name="authorName"
                          type="text"
                          value={formData.authorName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="authorEmail">Author Email</Label>
                        <Input
                          id="authorEmail"
                          name="authorEmail"
                          type="email"
                          value={formData.authorEmail}
                          onChange={handleInputChange}
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
                        name="seo.metaTitle"
                        value={formData.seo.metaTitle}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        name="seo.metaDescription"
                        value={formData.seo.metaDescription}
                        onChange={handleInputChange}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ogImage">OG Image URL</Label>
                      <Input
                        id="ogImage"
                        name="seo.ogImage"
                        value={formData.seo.ogImage}
                        onChange={handleInputChange}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <DialogFooter className="mt-6">
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Loading className="mr-2" />
                    ) : null}
                    {editingBlog ? 'Update' : 'Create'} Blog Post
                  </Button>
                </div>
              </DialogFooter>
            </form>
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
