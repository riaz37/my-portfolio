import { LucideIcon, Code2, Trophy, Users, BookOpen } from 'lucide-react';

export interface PlaygroundSection {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
  requiresVerification: boolean;
  progress?: number;
}

export const playgroundSections: PlaygroundSection[] = [
  {
    title: 'Practice Arena',
    description: 'Write, test, and debug code in our interactive coding environment.',
    href: '/playground/practice-arena',
    icon: Code2,
    color: 'bg-blue-500/10 text-blue-500',
    requiresVerification: false
  },
  {
    title: 'Learning Paths',
    description: 'Follow structured learning paths to master new skills.',
    href: '/playground/learning-paths',
    icon: BookOpen,
    color: 'bg-green-500/10 text-green-500',
    requiresVerification: false
  },
  {
    title: 'Community Hub',
    description: 'Share projects and collaborate with other developers.',
    href: '/playground/community-hub',
    icon: Users,
    color: 'bg-purple-500/10 text-purple-500',
    requiresVerification: true
  },
  {
    title: 'Leaderboard',
    description: 'Track your progress and compete with others.',
    href: '/playground/leaderboard',
    icon: Trophy,
    color: 'bg-yellow-500/10 text-yellow-500',
    requiresVerification: true
  }
];
