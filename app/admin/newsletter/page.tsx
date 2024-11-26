'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Textarea } from '@/components/shared/ui/core/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/core/select';
import { toast } from 'sonner';
import { FaPaperPlane, FaTrash, FaEnvelope, FaCalendar, FaBell } from 'react-icons/fa';
import { newsletterTemplates, getTemplateById, getDefaultTemplateData } from '@/lib/email';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/ui/core/table";
import { Badge } from "@/components/shared/ui/core/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/ui/core/tabs";

interface TemplateData {
  [key: string]: string;
}

interface Subscriber {
  email: string;
  isSubscribed: boolean;
  subscriptionDate: string;
  preferences: {
    weeklyDigest: boolean;
    newChallenges: boolean;
    productUpdates: boolean;
  };
  lastEmailSent?: string;
  bounceCount: number;
}

export default function NewsletterAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateData, setTemplateData] = useState<TemplateData>({});
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/subscribers');
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }
      const data = await response.json();
      setSubscribers(data);
    } catch (error) {
      toast.error('Failed to load subscribers');
    }
  };

  const handleDeleteSubscriber = async (email: string) => {
    try {
      const response = await fetch('/api/admin/newsletter/subscribers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete subscriber');
      }

      toast.success('Subscriber deleted successfully');
      fetchSubscribers(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete subscriber');
    }
  };

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId === 'custom') {
      setTemplateData({});
      setFormData({ subject: '', content: '' });
      return;
    }
    const template = getTemplateById(templateId);
    if (template) {
      const defaultData = getDefaultTemplateData(templateId);
      setTemplateData(defaultData);
      const { subject, content } = template.getTemplate(defaultData);
      setFormData({ subject, content });
    }
  };

  // Handle template data changes
  const handleTemplateDataChange = (key: string, value: string) => {
    const newTemplateData = { ...templateData, [key]: value };
    setTemplateData(newTemplateData);
    
    const template = getTemplateById(selectedTemplate);
    if (template) {
      const { subject, content } = template.getTemplate(newTemplateData);
      setFormData({ subject, content });
    }
  };

  // Redirect if not admin
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated' || !session?.user?.isAdmin) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Newsletter sent to ${data.subscriberCount} subscribers!`);
        setFormData({ subject: '', content: '' });
        setSelectedTemplate('');
        setTemplateData({});
      } else {
        throw new Error(data.message || 'Failed to send newsletter');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Newsletter Management</h1>
        <p className="text-muted-foreground">
          Manage your newsletter subscribers and send newsletters.
        </p>
      </div>

      <Tabs defaultValue="subscribers">
        <TabsList className="mb-8">
          <TabsTrigger value="subscribers">
            <FaEnvelope className="mr-2" />
            Subscribers
          </TabsTrigger>
          <TabsTrigger value="compose">
            <FaPaperPlane className="mr-2" />
            Compose Newsletter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription Date</TableHead>
                  <TableHead>Preferences</TableHead>
                  <TableHead>Last Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.email}>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell>
                      <Badge variant={subscriber.isSubscribed ? "success" : "destructive"}>
                        {subscriber.isSubscribed ? "Subscribed" : "Unsubscribed"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(subscriber.subscriptionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {subscriber.preferences.weeklyDigest && (
                          <Badge variant="outline">Weekly Digest</Badge>
                        )}
                        {subscriber.preferences.newChallenges && (
                          <Badge variant="outline">New Challenges</Badge>
                        )}
                        {subscriber.preferences.productUpdates && (
                          <Badge variant="outline">Product Updates</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {subscriber.lastEmailSent 
                        ? new Date(subscriber.lastEmailSent).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSubscriber(subscriber.email)}
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="compose">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Template
              </label>
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Template</SelectItem>
                  {newsletterTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Data Fields */}
            {selectedTemplate && Object.keys(templateData).length > 0 && (
              <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                <h3 className="font-medium">Template Data</h3>
                {Object.entries(templateData).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    {value.includes('\n') ? (
                      <Textarea
                        value={value}
                        onChange={(e) => handleTemplateDataChange(key, e.target.value)}
                        className="h-32"
                      />
                    ) : (
                      <Input
                        value={value}
                        onChange={(e) => handleTemplateDataChange(key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Subject and Content */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => !selectedTemplate && setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Newsletter Subject"
                required
                disabled={loading || !!selectedTemplate}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                Content (HTML)
              </label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => !selectedTemplate && setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="<h1>Hello subscribers!</h1><p>Your newsletter content here...</p>"
                className="h-64 font-mono"
                required
                disabled={loading || !!selectedTemplate}
              />
            </div>

            <div className="flex justify-end gap-4">
              {selectedTemplate && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedTemplate('');
                    setTemplateData({});
                    setFormData({ subject: '', content: '' });
                  }}
                >
                  Clear Template
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={loading}
              >
                <FaPaperPlane className="mr-2 h-4 w-4" />
                {loading ? 'Sending...' : 'Send Newsletter'}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
