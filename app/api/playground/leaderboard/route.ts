import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db/mongodb';
import mongoose from 'mongoose';
import { Leaderboard } from '@/models/Leaderboard';
import { UserSkill } from '@/models/UserSkill';
import { Achievement } from '@/models/Achievement';
import { User } from '@/models/User';

// Sample leaderboard entries for initialization
const SAMPLE_LEADERBOARD = [
  {
    userId: 'sample1',
    points: 2500,
    gamesCompleted: 15,
    achievementsCount: 8,
    topSkill: {
      name: 'JavaScript',
      level: 75
    },
    rank: 1,
    lastUpdated: new Date()
  },
  {
    userId: 'sample2',
    points: 2200,
    gamesCompleted: 12,
    achievementsCount: 7,
    topSkill: {
      name: 'React',
      level: 70
    },
    rank: 2,
    lastUpdated: new Date()
  },
  {
    userId: 'sample3',
    points: 1800,
    gamesCompleted: 10,
    achievementsCount: 6,
    topSkill: {
      name: 'HTML/CSS',
      level: 65
    },
    rank: 3,
    lastUpdated: new Date()
  },
  {
    userId: 'sample4',
    points: 1500,
    gamesCompleted: 8,
    achievementsCount: 5,
    topSkill: {
      name: 'TypeScript',
      level: 60
    },
    rank: 4,
    lastUpdated: new Date()
  },
  {
    userId: 'sample5',
    points: 1200,
    gamesCompleted: 6,
    achievementsCount: 4,
    topSkill: {
      name: 'Node.js',
      level: 55
    },
    rank: 5,
    lastUpdated: new Date()
  },
  {
    userId: 'sample6',
    points: 1000,
    gamesCompleted: 5,
    achievementsCount: 3,
    topSkill: {
      name: 'Python',
      level: 50
    },
    rank: 6,
    lastUpdated: new Date()
  },
  {
    userId: 'sample7',
    points: 800,
    gamesCompleted: 4,
    achievementsCount: 2,
    topSkill: {
      name: 'Vue.js',
      level: 45
    },
    rank: 7,
    lastUpdated: new Date()
  },
  {
    userId: 'sample8',
    points: 600,
    gamesCompleted: 3,
    achievementsCount: 1,
    topSkill: {
      name: 'Angular',
      level: 40
    },
    rank: 8,
    lastUpdated: new Date()
  }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await connectToDatabase();

    // Initialize leaderboard if empty
    const existingEntries = await Leaderboard.countDocuments();
    if (existingEntries === 0) {
      await Leaderboard.insertMany(SAMPLE_LEADERBOARD);
    }

    // Get leaderboard
    const leaderboard = await Leaderboard.find()
      .sort({ points: -1, gamesCompleted: -1 })
      .limit(10)
      .lean();

    // Add current user if authenticated
    if (session?.user?.id) {
      // Get user's top skill
      const userSkills = await UserSkill.findOne({ userId: session.user.id })
        .sort({ 'skills.level': -1 })
        .lean();

      // Get achievements count
      const achievementsCount = await Achievement.countDocuments({
        userId: session.user.id
      });

      // Get user's profile
      const userProfile = await User.findById(session.user.id).select('name image').lean();

      if (userProfile) {
        const userStats = {
          userId: session.user.id,
          points: 0, // Calculate from achievements and games
          gamesCompleted: 0, // Calculate from completed games
          achievementsCount,
          topSkill: userSkills ? {
            name: Object.keys(userSkills.skills)[0],
            level: Object.values(userSkills.skills)[0]
          } : null,
          rank: 0,
          lastUpdated: new Date()
        };

        // Calculate user's rank
        const higherRankedUsers = await Leaderboard.countDocuments({
          points: { $gt: userStats.points }
        });
        userStats.rank = higherRankedUsers + 1;

        // Add user to leaderboard if they're not already in top 10
        if (!leaderboard.some(entry => entry.userId === session.user.id)) {
          leaderboard.push(userStats);
        }
      }
    }

    // Enrich leaderboard with user details
    const enrichedLeaderboard = await Promise.all(
      leaderboard.map(async (entry) => {
        if (entry.userId.startsWith('sample')) {
          return {
            ...entry,
            name: `Player ${entry.rank}`,
            image: `/avatars/avatar${entry.rank}.png`,
            isCurrentUser: false
          };
        }

        const user = await User.findById(entry.userId).select('name image').lean();
        return {
          ...entry,
          name: user?.name || 'Anonymous User',
          image: user?.image || '/avatars/default.png',
          isCurrentUser: session?.user?.id === entry.userId
        };
      })
    );

    return NextResponse.json(enrichedLeaderboard);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
