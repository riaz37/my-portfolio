'use client';

import { motion } from 'framer-motion';
import { sectionTitles } from '@/lib/config/section-titles';
import { SectionTitle } from '@/components/shared/ui/layout/SectionTitle';
import { Button } from "@/components/ui/button";
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
} from "@/components/shared/ui/data-display/card";

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
      description: 'Commits in the last year'
    },
    {
      title: 'Public Repositories',
      value: stats?.totalRepos || 0,
      icon: FaCodeBranch,
      description: 'Personal and collaborative projects'
    },
    {
      title: 'Total Stars',
      value: stats?.totalStars || 0,
      icon: FaStar,
      description: 'Stars across all repositories'
    },
    {
      title: 'GitHub Community',
      value: stats?.followers || 0,
      icon: HiUsers,
      description: `${stats?.following || 0} following`
    }
  ];

  if (loading) {
    return (
      <section id={sectionTitles.github.id} className="container py-24 sm:py-32">
        <SectionTitle
          title={sectionTitles.github.title}
          subtitle={sectionTitles.github.subtitle}
        />
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  return (
    <section id={sectionTitles.github.id} className="container py-24 sm:py-32">
      <SectionTitle
        title={sectionTitles.github.title}
        subtitle={sectionTitles.github.subtitle}
      />

      {error ? (
        <div className="mt-8 text-center">
          <Card className="max-w-lg mx-auto">
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
        <div className="mt-8">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <card.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
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
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stats.topLanguages).map(([lang, bytes], index) => (
                      <div
                        key={lang}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm",
                          "bg-primary/10 text-primary"
                        )}
                      >
                        {lang}
                      </div>
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
              className="mt-8 text-center"
            >
              <a
                href={stats.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  <FaGithub className="h-4 w-4" />
                  View GitHub Profile
                </Button>
              </a>
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}
