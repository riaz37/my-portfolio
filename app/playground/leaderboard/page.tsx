'use client';

import { motion } from 'framer-motion';
import { Medal, Trophy, Award, Crown, Sparkles, ChevronUp, Star, Construction } from 'lucide-react';
import { Card } from '@/components/shared/ui/data-display/card';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { Progress } from '@/components/shared/ui/feedback/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/ui/data-display/avatar';
import { AvatarSelector } from '@/components/shared/ui/data-display/avatar-selector';
import { Button } from '@/components/shared/ui/core/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/navigation/tabs';

// Mock data for demonstration
const topUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/avatars/avatar-1.png",
    points: 12580,
    rank: 1,
    badge: "Diamond",
    progress: 92,
    streak: 45,
    solved: 342,
    contributions: 89
  },
  {
    id: 2,
    name: "Alex Kumar",
    avatar: "/avatars/avatar-2.png",
    points: 11975,
    rank: 2,
    badge: "Diamond",
    progress: 88,
    streak: 38,
    solved: 315,
    contributions: 76
  },
  {
    id: 3,
    name: "Maria Garcia",
    avatar: "/avatars/avatar-3.png",
    points: 11840,
    rank: 3,
    badge: "Platinum",
    progress: 85,
    streak: 41,
    solved: 298,
    contributions: 82
  },
  // More top users...
];

// Current user data (not in top ranks)
const currentUser = {
  id: 42,
  name: "David Wilson",
  avatar: "/avatars/avatar-4.png",
  points: 5240,
  rank: 156,
  badge: "Gold",
  progress: 45,
  streak: 12,
  solved: 124,
  contributions: 28,
  nextRank: {
    points: 6000,
    name: "Platinum",
    user: "Emma Thompson"
  }
};

const badgeColors = {
  Diamond: "text-blue-500",
  Platinum: "text-purple-500",
  Gold: "text-yellow-500",
  Silver: "text-gray-400",
  Bronze: "text-orange-500"
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text">
          Developer Leaderboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Compete with fellow developers, earn badges, and climb the ranks by contributing and solving challenges.
        </p>
      </motion.div>

      <Tabs defaultValue="global" className="mb-12">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>
        <TabsContent value="global" className="mt-6">
          {/* Top 3 Winners Podium */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto"
          >
            {/* Second Place */}
            <motion.div variants={itemVariants} className="pt-12">
              <Card className="p-6 text-center relative">
                <Medal className="w-8 h-8 text-gray-400 absolute -top-4 left-1/2 -translate-x-1/2" />
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarImage src={topUsers[1].avatar} alt={topUsers[1].name} />
                  <AvatarFallback>{topUsers[1].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{topUsers[1].name}</h3>
                <p className="text-muted-foreground text-sm mb-2">{topUsers[1].points.toLocaleString()} pts</p>
                <Badge variant="secondary" className={badgeColors[topUsers[1].badge]}>
                  {topUsers[1].badge}
                </Badge>
              </Card>
            </motion.div>

            {/* First Place */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 text-center relative border-yellow-500/50 bg-gradient-to-b from-yellow-500/10 to-transparent">
                <Crown className="w-10 h-10 text-yellow-500 absolute -top-5 left-1/2 -translate-x-1/2" />
                <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-yellow-500/50">
                  <AvatarImage src={topUsers[0].avatar} alt={topUsers[0].name} />
                  <AvatarFallback>{topUsers[0].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{topUsers[0].name}</h3>
                <p className="text-muted-foreground mb-2">{topUsers[0].points.toLocaleString()} pts</p>
                <Badge variant="secondary" className={badgeColors[topUsers[0].badge]}>
                  {topUsers[0].badge}
                </Badge>
              </Card>
            </motion.div>

            {/* Third Place */}
            <motion.div variants={itemVariants} className="pt-16">
              <Card className="p-6 text-center relative">
                <Award className="w-8 h-8 text-orange-500 absolute -top-4 left-1/2 -translate-x-1/2" />
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarImage src={topUsers[2].avatar} alt={topUsers[2].name} />
                  <AvatarFallback>{topUsers[2].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{topUsers[2].name}</h3>
                <p className="text-muted-foreground text-sm mb-2">{topUsers[2].points.toLocaleString()} pts</p>
                <Badge variant="secondary" className={badgeColors[topUsers[2].badge]}>
                  {topUsers[2].badge}
                </Badge>
              </Card>
            </motion.div>
          </motion.div>

          {/* Current User Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{currentUser.name}</h3>
                    <p className="text-muted-foreground">Rank #{currentUser.rank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className={badgeColors[currentUser.badge]}>
                    {currentUser.badge}
                  </Badge>
                  <p className="text-2xl font-bold mt-2">{currentUser.points.toLocaleString()} pts</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress to {currentUser.nextRank.name}</span>
                    <span className="font-medium">{currentUser.progress}%</span>
                  </div>
                  <Progress value={currentUser.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <Star className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                    <p className="text-lg font-semibold">{currentUser.streak}</p>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Trophy className="w-5 h-5 text-green-500 mx-auto mb-2" />
                    <p className="text-lg font-semibold">{currentUser.solved}</p>
                    <p className="text-sm text-muted-foreground">Challenges Solved</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Sparkles className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                    <p className="text-lg font-semibold">{currentUser.contributions}</p>
                    <p className="text-sm text-muted-foreground">Contributions</p>
                  </Card>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Next Rank</p>
                    <p className="font-medium">{currentUser.nextRank.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Points Needed</p>
                    <p className="font-medium">{(currentUser.nextRank.points - currentUser.points).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="monthly">
          <div className="text-center text-muted-foreground">
            Monthly rankings will be available at the end of the month.
          </div>
        </TabsContent>

        <TabsContent value="weekly">
          <div className="text-center text-muted-foreground">
            Weekly rankings will be available at the end of the week.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
