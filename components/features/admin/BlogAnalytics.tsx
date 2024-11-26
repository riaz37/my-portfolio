'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/ui/core/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/core/tabs';

interface AnalyticsData {
  views: {
    total: number;
    trend: { date: string; count: number }[];
  };
  engagement: {
    averageReadTime: number;
    completionRate: number;
    likes: number;
  };
  popular: {
    posts: { title: string; views: number }[];
    tags: { name: string; count: number }[];
    categories: { name: string; count: number }[];
  };
}

export default function BlogAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const response = await fetch('/api/admin/blogs/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
            <CardDescription>All time blog views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.views.total.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Read Time</CardTitle>
            <CardDescription>Time spent reading</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.engagement.averageReadTime} min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
            <CardDescription>Readers who finish articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.engagement.completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="views">
            <TabsList>
              <TabsTrigger value="views">Views Trend</TabsTrigger>
              <TabsTrigger value="popular">Popular Posts</TabsTrigger>
              <TabsTrigger value="tags">Top Tags</TabsTrigger>
            </TabsList>
            
            <TabsContent value="views">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.views.trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="popular">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.popular.posts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="tags">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.popular.tags}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Top Content */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
            <CardDescription>Most used blog categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {data.popular.categories.map((category, index) => (
                <li key={category.name} className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground">{index + 1}.</span>
                    {category.name}
                  </span>
                  <span className="text-muted-foreground">{category.count} posts</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trending Tags</CardTitle>
            <CardDescription>Most popular blog tags</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {data.popular.tags.map((tag, index) => (
                <li key={tag.name} className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground">{index + 1}.</span>
                    {tag.name}
                  </span>
                  <span className="text-muted-foreground">{tag.count} uses</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
