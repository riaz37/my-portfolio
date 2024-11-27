'use client';

import { motion } from 'framer-motion';
import { sectionTitles } from '@/lib/config/section-titles';
import { SectionTitle } from '@/components/shared/ui/section';
import { Button } from "@/components/shared/ui/core/button";
import { FaGithub, FaCode, FaStar, FaCodeBranch } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/shared/ui/core/card';

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  followers: number;
  following: number;
  contributions: number;
  topLanguages: { [key: string]: number };
  profileUrl: string;
}

export function GitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/github/stats');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || data.details || 'Failed to fetch GitHub statistics');
        }
        
        setStats(data);
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to load GitHub statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Contributions',
      value: stats?.contributions || 0,
      icon: FaCode,
      description: 'Commits in the last year',
      gradient: 'from-green-500 to-emerald-700'
    },
    {
      title: 'Public Repositories',
      value: stats?.totalRepos || 0,
      icon: FaCodeBranch,
      description: 'Personal and collaborative projects',
      gradient: 'from-blue-500 to-violet-600'
    },
    {
      title: 'Total Stars',
      value: stats?.totalStars || 0,
      icon: FaStar,
      description: 'Stars across all repositories',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      title: 'GitHub Community',
      value: stats?.followers || 0,
      icon: HiUsers,
      description: `${stats?.following || 0} following`,
      gradient: 'from-pink-500 to-rose-600'
    }
  ];

  if (loading) {
    return (
      <section className="container py-24">
        <SectionTitle 
          highlight="Open Source"
          badge="GitHub"
          subtitle="My contributions and activity in the open source community."
          showDecoration={true}
        >
          GitHub Activity
        </SectionTitle>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-8 right-0 w-72 h-72 bg-secondary/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      <div className="relative">
        <SectionTitle 
          highlight="Open Source"
          badge="GitHub"
          subtitle="My contributions and activity in the open source community."
          showDecoration={true}
        >
          GitHub Activity
        </SectionTitle>

        {error ? (
          <div className="mt-8 text-center">
            <Card className="max-w-lg mx-auto border border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mt-12 space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to bottom right, ${card.gradient})` }} />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {card.title}
                      </CardTitle>
                      <card.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent group-hover:animate-gradient-x transition-all duration-300" style={{ backgroundImage: `linear-gradient(to right, ${card.gradient})` }}>
                        {card.value.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Languages Section */}
            {stats?.topLanguages && Object.keys(stats.topLanguages).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border-0 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Most Used Languages</CardTitle>
                    <CardDescription>Technologies I frequently work with</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(stats.topLanguages).map(([lang, bytes], index) => (
                        <motion.div
                          key={lang}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium",
                            "bg-gradient-to-r from-primary/10 to-primary/5",
                            "border border-primary/10",
                            "hover:border-primary/20 transition-colors duration-300"
                          )}
                        >
                          {lang}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* GitHub Profile Link */}
            {stats?.profileUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex justify-center"
              >
                <a
                  href={stats.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button 
                    variant="outline" 
                    className="group relative overflow-hidden border-primary/20 hover:border-primary/30"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-2">
                      <FaGithub className="h-4 w-4" />
                      View GitHub Profile
                    </span>
                  </Button>
                </a>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
