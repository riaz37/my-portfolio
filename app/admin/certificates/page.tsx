'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { DataTable } from '@/components/features/admin/DataTable';
import { Button } from '@/components/shared/ui/core/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/shared/ui/overlay/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/shared/ui/core/form';
import { Input } from '@/components/shared/ui/core/input';
import { Textarea } from '@/components/shared/ui/core/textarea';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form Schema
const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    { message: 'Invalid issue date' }
  ),
  expiryDate: z.string().optional().refine(
    (date) => !date || !isNaN(Date.parse(date)),
    { message: 'Invalid expiry date' }
  ).refine(
    (date, ctx) => {
      if (!date) return true;
      const issueDate = ctx.parent.issueDate;
      if (!issueDate) return true;
      return new Date(date) > new Date(issueDate);
    },
    { message: 'Expiry date must be after issue date' }
  ),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url('Invalid credential URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Invalid image URL').min(1, 'Image URL is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  skills: z.array(z.string()).default([]).transform(skills => skills.filter(skill => skill.trim())),
  featured: z.boolean().default(false),
});

interface Certificate extends z.infer<typeof certificateSchema> {
  _id: string;
}

type CertificateFormValues = z.infer<typeof certificateSchema>;

export default function CertificatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {toast} = useCustomToast();

  const columns = [
    { 
      key: 'title', 
      label: 'Title', 
      sortable: true,
      className: 'min-w-[200px]'
    },
    { 
      key: 'issuer', 
      label: 'Issuer',
      className: 'min-w-[150px]'
    },
    { 
      key: 'category', 
      label: 'Category',
      className: 'hidden md:table-cell'
    },
    { 
      key: 'issueDate', 
      label: 'Issue Date',
      render: (date: string) => new Date(date).toLocaleDateString(),
      className: 'hidden md:table-cell'
    },
    { 
      key: 'skills', 
      label: 'Skills',
      render: (skills: string[]) => skills?.join(', ') || '',
      className: 'hidden lg:table-cell'
    },
    { 
      key: 'featured', 
      label: 'Featured',
      render: (featured: boolean) => featured ? 'Yes' : 'No',
      className: 'w-[100px] text-center'
    }
  ];

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      imageUrl: '',
      category: '',
      description: '',
      skills: [],
      featured: false,
    },
  });

  // Fetch certificates
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchCertificates = async () => {
      try {
        const response = await fetch('/api/admin/certificates');
        if (!response.ok) throw new Error('Failed to fetch certificates');
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch certificates',
          variant: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, [status, router]);

  const onSubmit = async (data: CertificateFormValues) => {
    try {
      // Validate required fields
      const requiredFields = ['title', 'issuer', 'issueDate', 'imageUrl', 'category'];
      for (const field of requiredFields) {
        if (!data[field as keyof CertificateFormValues]) {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
      }

      // Validate dates
      const issueDate = new Date(data.issueDate);
      if (isNaN(issueDate.getTime())) {
        throw new Error('Invalid issue date');
      }

      if (data.expiryDate) {
        const expiryDate = new Date(data.expiryDate);
        if (isNaN(expiryDate.getTime())) {
          throw new Error('Invalid expiry date');
        }
        if (expiryDate < issueDate) {
          throw new Error('Expiry date must be after issue date');
        }
      }

      // Validate URLs
      const urlFields = ['credentialUrl', 'imageUrl'] as const;
      for (const field of urlFields) {
        if (data[field]) {
          try {
            new URL(data[field] as string);
          } catch {
            throw new Error(`Invalid ${field.replace('Url', ' URL')}`);
          }
        }
      }

      // Clean up skills array
      data.skills = data.skills.filter(skill => skill.trim());

      // IMPORTANT: Explicitly log the featured status
      console.log('Certificate submission data:', {
        ...data,
        featured: data.featured ?? false
      });

      const url = selectedCertificate 
        ? `/api/admin/certificates/${selectedCertificate._id}`
        : '/api/admin/certificates';
      
      const method = selectedCertificate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          featured: data.featured ?? false  // Ensure featured is always a boolean
        }),
      });

      const result = await response.json();

      // Check response status
      if (!response.ok) {
        // If response is not ok, throw an error with details
        const errorMessage = result.error || result.details?.map((err: any) => err.message).join(', ') || 'Failed to save certificate';
        throw new Error(errorMessage);
      }
      
      // Log the returned certificate to verify featured status
      console.log('Saved certificate:', result);

      setCertificates(prev => 
        selectedCertificate
          ? prev.map(cert => cert._id === result._id ? result : cert)
          : [...prev, result]
      );

      setIsDialogOpen(false);
      setSelectedCertificate(null);
      form.reset();

      toast({
        title: 'Success',
        description: `Certificate ${selectedCertificate ? 'updated' : 'created'} successfully`,
        variant: 'success'
      });
    } catch (error) {
      console.error('Certificate submission error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save certificate',
        variant: 'error'
      });
    }
  };

  const handleDelete = async (certificate: Certificate) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const response = await fetch(`/api/admin/certificates/${certificate._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete certificate');

      const result = await response.json();
      setCertificates(prev => prev.filter(cert => cert._id !== certificate._id));
      
      toast({
        title: 'Success',
        description: 'Certificate deleted successfully',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete certificate',
        variant: 'error'
      });
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    form.reset({
      title: certificate.title,
      issuer: certificate.issuer,
      issueDate: new Date(certificate.issueDate).toISOString().split('T')[0],
      expiryDate: certificate.expiryDate 
        ? new Date(certificate.expiryDate).toISOString().split('T')[0]
        : '',
      credentialId: certificate.credentialId || '',
      credentialUrl: certificate.credentialUrl || '',
      imageUrl: certificate.imageUrl,
      category: certificate.category,
      description: certificate.description || '',
      skills: certificate.skills || [],
      featured: certificate.featured,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Certificates</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setSelectedCertificate(null);
                form.reset();
              }}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedCertificate ? 'Edit Certificate' : 'Add Certificate'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Certificate title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issuer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer</FormLabel>
                      <FormControl>
                        <Input placeholder="Issuing organization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="credentialId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credential ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Credential ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="credentialUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credential URL (Optional)</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Web Development" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the certificate" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium leading-none">
                        Featured (show in portfolio)
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setSelectedCertificate(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedCertificate ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable 
        data={certificates}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
