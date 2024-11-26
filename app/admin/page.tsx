'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Eye,
  ThumbsUp,
  GamepadIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Loading } from '@/components/shared/loading';

interface Stats {
  posts: number;
  projects: number;
  testimonials: number;
  views: number;
  likes: number;
  games: number;
}

const statCards = [
  {
    name: 'Blog Posts',
    icon: <FileText className="h-6 w-6" />,
    color: 'from-blue-500/20 to-cyan-500/20',
    href: '/admin/blog',
    stat: 'posts',
  },
  {
    name: 'Projects',
    icon: <Briefcase className="h-6 w-6" />,
    color: 'from-purple-500/20 to-pink-500/20',
    href: '/admin/projects',
    stat: 'projects',
  },
  {
    name: 'Playground',
    icon: <GamepadIcon className="h-6 w-6" />,
    color: 'from-indigo-500/20 to-violet-500/20',
    href: '/admin/playground',
    stat: 'games',
  },
  {
    name: 'Testimonials',
    icon: <MessageSquare className="h-6 w-6" />,
    color: 'from-orange-500/20 to-red-500/20',
    href: '/admin/testimonials',
    stat: 'testimonials',
  },
  {
    name: 'Page Views',
    icon: <Eye className="h-6 w-6" />,
    color: 'from-green-500/20 to-emerald-500/20',
    href: '/admin/analytics',
    stat: 'views',
  },
  {
    name: 'Total Likes',
    icon: <ThumbsUp className="h-6 w-6" />,
    color: 'from-yellow-500/20 to-orange-500/20',
    href: '/admin/analytics',
    stat: 'likes',
  },
];

const recentActivities = [
  {
    id: 1,
    icon: <FileText className="h-4 w-4" />,
    title: 'New Blog Post Published',
    description: 'Published "Getting Started with Next.js 14"',
    date: '2 hours ago',
  },
  {
    id: 2,
    icon: <Briefcase className="h-4 w-4" />,
    title: 'Project Updated',
    description: 'Updated portfolio website project details',
    date: '5 hours ago',
  },
  {
    id: 3,
    icon: <MessageSquare className="h-4 w-4" />,
    title: 'New Testimonial',
    description: 'Received a new testimonial from John Doe',
    date: '1 day ago',
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    projects: 0,
    testimonials: 0,
    views: 0,
    likes: 0,
    games: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <Loading text="Loading stats..." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card, index) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-6"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10 transition-opacity duration-300 group-hover:opacity-20`}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-primary">{card.icon}</div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {card.name}
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {stats[card.stat]}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4 rounded-lg p-3 hover:bg-accent/50"
            >
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                {activity.icon}
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.date}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
