'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Label } from '@/components/shared/ui/core/label';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/ui/core/card';
import { Loading } from '@/components/shared/loading';

export default function CreateAdmin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useCustomToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        adminKey: formData.get('adminKey'),
      };

      const response = await fetch('/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create admin');
      }

      toast({
        title: 'Success',
        description: 'Admin user created successfully',
      });

      router.push('/admin/login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create Admin Account</CardTitle>
          <CardDescription>Create a new admin user account</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loading text="Creating admin account..." fullScreen={false} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminKey">Admin Creation Key</Label>
                <Input
                  id="adminKey"
                  name="adminKey"
                  type="password"
                  required
                  placeholder="Enter admin creation key"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Admin'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
