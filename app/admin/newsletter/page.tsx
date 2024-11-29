'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Textarea } from '@/components/shared/ui/core/textarea';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shared/ui/core/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/core/tabs';
import { Label } from '@/components/shared/ui/core/label';
import { Switch } from '@/components/shared/ui/core/switch';
import { Badge } from '@/components/shared/ui/core/badge';
import { FaPaperPlane, FaUserAlt } from 'react-icons/fa';
import { Loading } from '@/components/shared/loading';

interface Subscriber {
  _id: string;
  email: string;
  isSubscribed: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

export default function NewsletterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useCustomToast();
  
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isTest, setIsTest] = useState(true);
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sentNewsletters, setSentNewsletters] = useState([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('custom');

  const templates = [
    { id: 'custom', name: 'Custom Template' },
    { id: 'welcome', name: 'Welcome Email' },
    { id: 'weekly-digest', name: 'Weekly Digest' },
    { id: 'challenge-complete', name: 'Challenge Complete' },
  ];

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated") {
      router.push('/auth/signin');
      return;
    }

    if (!session?.user?.isAdmin) {
      router.push('/');
      return;
    }

    fetchNewsletterHistory();
    fetchSubscribers();
  }, [status, session, router]);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/subscribers');
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }
      const data = await response.json();
      setSubscribers(data.subscribers);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load subscribers',
        variant: 'error',
      });
    }
  };

  const fetchNewsletterHistory = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/history');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch newsletter history');
      }
      const data = await response.json();
      setSentNewsletters(data.newsletters);
      setSubscriberCount(data.subscriberCount);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load newsletter history',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNewsletter = async () => {
    try {
      setIsSending(true);
      const response = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          content,
          test: isTest,
          testEmail: isTest ? testEmail : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send newsletter');
      }

      toast({
        title: 'Success',
        description: isTest ? 'Test email sent successfully' : 'Newsletter sent successfully',
      });

      if (!isTest) {
        setSubject('');
        setContent('');
        fetchNewsletterHistory();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send newsletter',
        variant: 'error',
      });
    } finally {
      setIsSending(false);
    }
  };

  const loadTemplate = async (templateId: string) => {
    if (templateId === 'custom') {
      setContent('');
      setSubject('');
      return;
    }

    try {
      const response = await fetch(`/api/admin/newsletter/template/${templateId}`);
      if (!response.ok) {
        throw new Error('Failed to load template');
      }
      
      const data = await response.json();
      setContent(data.content);
      setSubject(data.subject);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load template',
        variant: 'error',
      });
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    loadTemplate(templateId);
  };

  const handleSend = () => {
    handleSendNewsletter();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {isLoading ? (
        <Loading text="Loading newsletter data..." />
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">Newsletter Management</h1>
          <div className="grid gap-6">
            <Tabs defaultValue="compose">
              <TabsList>
                <TabsTrigger value="compose">Compose</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              </TabsList>

              <TabsContent value="compose">
                <Card>
                  <CardHeader>
                    <CardTitle>Compose Newsletter</CardTitle>
                    <CardDescription>
                      Send a newsletter to {subscriberCount} subscriber{subscriberCount !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="template">Email Template</Label>
                      <select
                        id="template"
                        value={selectedTemplate}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Newsletter subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea
                        placeholder="Write your newsletter content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[200px]"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="test-mode"
                          checked={isTest}
                          onCheckedChange={setIsTest}
                        />
                        <Label htmlFor="test-mode">Test Mode</Label>
                      </div>
                      {isTest && (
                        <div className="flex-1">
                          <Input
                            id="test-email"
                            type="email"
                            placeholder="Enter test email address"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSend}
                      disabled={isSending || !subject || !content || (isTest && !testEmail)}
                      className="w-full sm:w-auto"
                    >
                      <FaPaperPlane className="mr-2" />
                      {isSending ? 'Sending...' : `Send ${isTest ? 'Test' : ''} Newsletter`}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Newsletter History</CardTitle>
                    <CardDescription>
                      View previously sent newsletters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sentNewsletters.map((newsletter: any) => (
                          <div key={newsletter._id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold">{newsletter.subject}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(newsletter.sentAt).toLocaleDateString()} at{' '}
                                  {new Date(newsletter.sentAt).toLocaleTimeString()}
                                </p>
                              </div>
                              <Badge variant={newsletter.isTest ? 'secondary' : 'default'}>
                                {newsletter.isTest ? 'Test' : 'Sent'}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Recipients: {newsletter.recipientCount}
                              {newsletter.failedCount > 0 && (
                                <span className="text-destructive ml-2">
                                  ({newsletter.failedCount} failed)
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {sentNewsletters.length === 0 && (
                        <p className="text-center text-muted-foreground">
                          No newsletters have been sent yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscribers">
                <Card>
                  <CardHeader>
                    <CardTitle>Newsletter Subscribers</CardTitle>
                    <CardDescription>
                      View and manage newsletter subscribers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {subscribers.map((subscriber) => (
                          <div key={subscriber._id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <FaUserAlt className="text-muted-foreground" />
                                  <h3 className="font-semibold">{subscriber.email}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Subscribed on {new Date(subscriber.subscribedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant={subscriber.isSubscribed ? 'default' : 'secondary'}>
                                {subscriber.isSubscribed ? 'Active' : 'Unsubscribed'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      {subscribers.length === 0 && (
                        <p className="text-center text-muted-foreground">
                          No subscribers yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}
