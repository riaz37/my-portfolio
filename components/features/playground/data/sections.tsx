'use client';

import { 
  Code2, 
  Trophy,
  Users,
  Book,
  GamepadIcon,
  LucideIcon
} from 'lucide-react';

export interface PlaygroundSection {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  textColor: string;
  borderColor: string;
  gradient: string;
  tags: string[];
  requiresAuth?: boolean;
  progress?: number;
}

export const playgroundSections: PlaygroundSection[] = [
  {
    title: 'Coding Challenges',
    description: 'Master algorithms through interactive challenges with real-time feedback',
    icon: Code2,
    href: '/playground/challenges-list',
    color: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/20',
    gradient: 'hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-blue-600/20',
    tags: ['Algorithms', 'Data Structures', 'Daily Challenges'],
    requiresAuth: false,
    progress: 0
  },
  {
    title: 'Learning Paths',
    description: 'Personalized learning journeys with interactive tutorials and hands-on projects',
    icon: Book,
    href: '/playground/learning-paths',
    color: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500/20',
    gradient: 'hover:bg-gradient-to-br hover:from-orange-500/20 hover:to-orange-600/20',
    tags: ['Frontend', 'Backend', 'System Design', 'DevOps'],
    requiresAuth: false,
    progress: 0
  },
  {
    title: 'Leaderboard & Achievements',
    description: 'Compete globally, earn badges, and showcase your programming expertise',
    icon: Trophy,
    href: '/playground/leaderboard',
    color: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    borderColor: 'border-purple-500/20',
    gradient: 'hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-purple-600/20',
    tags: ['Rankings', 'Badges', 'Achievements'],
    requiresAuth: true,
    progress: 0
  },
  {
    title: 'Community Hub',
    description: 'Collaborate on projects, join study groups, and share knowledge',
    icon: Users,
    href: '/playground/community-hub',
    color: 'bg-green-500/10',
    textColor: 'text-green-500',
    borderColor: 'border-green-500/20',
    gradient: 'hover:bg-gradient-to-br hover:from-green-500/20 hover:to-green-600/20',
    tags: ['Projects', 'Mentorship', 'Discussion'],
    requiresAuth: true,
    progress: 0
  },
  {
    title: 'Practice Arena',
    description: 'Interactive coding environment with real-time compilation and testing',
    icon: GamepadIcon,
    href: '/playground/practice-arena',
    color: 'bg-pink-500/10',
    textColor: 'text-pink-500',
    borderColor: 'border-pink-500/20',
    gradient: 'hover:bg-gradient-to-br hover:from-pink-500/20 hover:to-pink-600/20',
    tags: ['JavaScript', 'Python', 'Live Editor'],
    requiresAuth: true,
    progress: 0
  }
];
