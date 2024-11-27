'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui/core/button';
import { Card } from '@/components/shared/ui/data-display/card';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { useToast } from '@/hooks/useToast';
import { motion } from 'framer-motion';
import { Loading } from '@/components/shared/loading';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  completed?: boolean;
}

export default function ChallengesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingChallenge, setLoadingChallenge] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchChallenges();
    }
  }, [status, router]);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/playground/challenges');
      if (!response.ok) throw new Error('Failed to fetch challenges');
      const data = await response.json();
      setChallenges(data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast({
        title: "Error",
        description: "Failed to load challenges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeClick = async (id: string) => {
    setLoadingChallenge(true);
    router.push(`/playground/challenges/${id}`);
  };

  if (status === 'loading') {
    return <Loading text="Loading challenges..." />;
  }

  return (
    <div className="container mx-auto p-6 relative">
      {loadingChallenge && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <Loading text="Loading challenge..." fullScreen={false} />
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Coding Challenges</h1>
        <div className="grid gap-6">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleChallengeClick(challenge.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold">{challenge.title}</h2>
                      <Badge
                        variant={
                          challenge.difficulty === 'Easy'
                            ? 'success'
                            : challenge.difficulty === 'Medium'
                            ? 'warning'
                            : 'destructive'
                        }
                      >
                        {challenge.difficulty}
                      </Badge>
                      {challenge.completed && (
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{challenge.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {challenge.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline">Start Challenge</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}