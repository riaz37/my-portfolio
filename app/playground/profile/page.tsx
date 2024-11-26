'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  Award,
  TrendingUp,
  Timer,
  BarChart,
  Brain,
  BookOpen,
  Lock,
  CheckCircle,
  History,
} from 'lucide-react';
import { Progress } from '@/components/shared/ui/feedback/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/ui/data-display/card';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/navigation/tabs';
import { UserProgress, UserSkill, UserAchievement } from '@/types/database';
import { EmptyState } from '@/components/shared/ui/data-display/empty-state';
import { cn } from '@/lib/utils';
import { AvatarSelector } from '@/components/shared/ui/data-display/avatar-selector';
import { toast } from 'sonner';
import { Loading } from '@/components/shared/loading';

interface Stats {
  totalXP: number;
  gamesCompleted: number;
  timeSpent: number;
  averageScore: number;
  skillsLearned: number;
  achievements: number;
}

const DEFAULT_ACHIEVEMENTS = [
  { title: 'Beginner', description: 'Complete 5 games' },
  { title: 'Intermediate', description: 'Complete 10 games' },
  { title: 'Advanced', description: 'Complete 20 games' },
  { title: 'Expert', description: 'Complete 50 games' },
];

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [currentAvatar, setCurrentAvatar] = useState<string>('');
  const [stats, setStats] = useState<Stats>({
    totalXP: 0,
    gamesCompleted: 0,
    timeSpent: 0,
    averageScore: 0,
    skillsLearned: 0,
    achievements: 0,
  });
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (session?.user && !isInitialized) {
      setIsInitialized(true);
      setCurrentAvatar(session.user.image || '/avatars/avatar1.png');
      fetchUserData();
    }
  }, [session, isInitialized]);

  const handleAvatarChange = async (newAvatar: string) => {
    try {
      setCurrentAvatar(newAvatar); // Optimistic update

      const response = await fetch('/api/user/update-avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatarUrl: newAvatar }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCurrentAvatar(session?.user?.image || ''); // Revert on error
        throw new Error(data.error || 'Failed to update avatar');
      }

      // Only update if the avatar actually changed
      if (session?.user?.image !== newAvatar) {
        await updateSession({
          user: {
            ...session?.user,
            image: newAvatar
          }
        });
      }

      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update avatar. Please try again.');
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [progressRes, skillsRes, achievementsRes] = await Promise.all([
        fetch('/api/playground/progress'),
        fetch('/api/playground/skills'),
        fetch('/api/playground/achievements')
      ]);

      const [progressData, skillsData, achievementsData] = await Promise.all([
        progressRes.json(),
        skillsRes.json(),
        achievementsRes.json()
      ]);

      // Process data
      const progressArray = Array.isArray(progressData) ? progressData : [];
      const skillsArray = Array.isArray(skillsData) ? skillsData : [];
      const achievementsArray = Array.isArray(achievementsData) ? achievementsData : [];

      // Update all state at once
      setProgress(progressArray);
      setSkills(skillsArray);
      setAchievements(achievementsArray);

      // Calculate stats
      const totalXP = progressArray.reduce((sum: number, p: UserProgress) => sum + (p.xpEarned || 0), 0);
      const completed = progressArray.filter((p: UserProgress) => 
        p.status === 'completed' || p.status === 'mastered'
      );
      const totalTime = progressArray.reduce((sum: number, p: UserProgress) => sum + (p.timeSpent || 0), 0);
      const avgScore = completed.length 
        ? completed.reduce((sum: number, p: UserProgress) => sum + (p.score || 0), 0) / completed.length 
        : 0;

      setStats({
        totalXP,
        gamesCompleted: completed.length,
        timeSpent: totalTime,
        averageScore: avgScore,
        skillsLearned: skillsArray.length,
        achievements: achievementsArray.length,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon={<Lock />}
          title="Access Denied"
          description="Please sign in to view your profile"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Loading text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 mt-16 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 pb-6">
        <div className="relative">
          <AvatarSelector
            currentAvatar={currentAvatar}
            onAvatarChange={handleAvatarChange}
          />
        </div>
        <div className="text-center md:text-left">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{session.user.name || 'User'}</h1>
            {session.user.emailVerified && (
              <CheckCircle className="w-6 h-6 text-primary" />
            )}
          </div>
          <p className="text-muted-foreground">{session.user.email}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="w-5 h-5 text-primary" />
              Total XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalXP.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-primary" />
              Games Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.gamesCompleted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Timer className="w-5 h-5 text-primary" />
              Time Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(stats.timeSpent / 60)} min
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(stats.averageScore)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-primary" />
              Skills Learned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.skillsLearned}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-primary" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.achievements}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="progress" className="w-full">
        <TabsList>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Progress
              </CardTitle>
              <CardDescription>
                Track your learning journey and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {progress.length === 0 ? (
                <EmptyState
                  icon={<History />}
                  title="No progress yet"
                  description="Start playing games to track your progress"
                />
              ) : (
                <div className="space-y-6">
                  {progress.map((p, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{p.gameName}</span>
                            <Badge variant={p.status === 'mastered' ? 'default' : 'secondary'}>
                              {p.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            XP Earned: {p.xpEarned} • Time: {Math.round(p.timeSpent / 60)}min
                          </div>
                        </div>
                        {p.score !== undefined && (
                          <div className="text-lg font-semibold">
                            {Math.round(p.score)}%
                          </div>
                        )}
                      </div>
                      <Progress value={p.status === 'mastered' ? 100 : (p.score || 0)} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Skills Progress
              </CardTitle>
              <CardDescription>
                Track your skill development and mastery
              </CardDescription>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <EmptyState
                  icon={<Brain />}
                  title="No skills yet"
                  description="Start playing games to develop skills"
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {skills.map((skill, i) => (
                    <Card key={i}>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{skill.icon}</span>
                              <div>
                                <div className="font-medium">{skill.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Level {skill.level}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Progress
                            value={(skill.level / skill.maxLevel) * 100}
                            className="h-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
              <CardDescription>
                Track your milestones and accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <EmptyState
                  icon={<Award />}
                  title="No achievements yet"
                  description="Complete games to earn achievements"
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {achievements.map((achievement, i) => (
                    <Card key={i}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {achievement.acquired ? (
                                <Award className="w-5 h-5 text-primary" />
                              ) : (
                                <Lock className="w-5 h-5 text-muted-foreground" />
                              )}
                              <span className="font-medium">
                                {achievement.title}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                          {achievement.acquired && (
                            <Badge variant="secondary">Completed</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
