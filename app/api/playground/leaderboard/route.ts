import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// Sample leaderboard entries for initialization
const SAMPLE_LEADERBOARD = [
  {
    userId: 'sample1',
    name: 'Alex Thompson',
    imageUrl: '/avatars/avatar1.png',
    totalXP: 2500,
    gamesCompleted: 15,
    topSkill: 'JavaScript',
    skillLevel: 75,
    achievements: 8,
    rank: 1,
    recentActivity: 'Mastered JavaScript Arena',
  },
  {
    userId: 'sample2',
    name: 'Sarah Chen',
    imageUrl: '/avatars/avatar2.png',
    totalXP: 2200,
    gamesCompleted: 12,
    topSkill: 'React',
    skillLevel: 70,
    achievements: 7,
    rank: 2,
    recentActivity: 'Completed React Challenge',
  },
  {
    userId: 'sample3',
    name: 'Michael Kim',
    imageUrl: '/avatars/avatar3.png',
    totalXP: 1800,
    gamesCompleted: 10,
    topSkill: 'HTML/CSS',
    skillLevel: 65,
    achievements: 6,
    rank: 3,
    recentActivity: 'Unlocked CSS Master',
  },
  {
    userId: 'sample4',
    name: 'Emma Davis',
    imageUrl: '/avatars/avatar4.png',
    totalXP: 1500,
    gamesCompleted: 8,
    topSkill: 'TypeScript',
    skillLevel: 60,
    achievements: 5,
    rank: 4,
    recentActivity: 'Completed TypeScript Basics',
  },
  {
    userId: 'sample5',
    name: 'James Wilson',
    imageUrl: '/avatars/avatar5.png',
    totalXP: 1200,
    gamesCompleted: 6,
    topSkill: 'Node.js',
    skillLevel: 55,
    achievements: 4,
    rank: 5,
    recentActivity: 'Started Backend Track',
  },
  {
    userId: 'sample6',
    name: 'Sophia Garcia',
    imageUrl: '/avatars/avatar6.png',
    totalXP: 1000,
    gamesCompleted: 5,
    topSkill: 'Python',
    skillLevel: 50,
    achievements: 3,
    rank: 6,
    recentActivity: 'Learning Python Basics',
  },
  {
    userId: 'sample7',
    name: 'David Lee',
    imageUrl: '/avatars/avatar7.png',
    totalXP: 800,
    gamesCompleted: 4,
    topSkill: 'Vue.js',
    skillLevel: 45,
    achievements: 2,
    rank: 7,
    recentActivity: 'Started Frontend Track',
  },
  {
    userId: 'sample8',
    name: 'Olivia Brown',
    imageUrl: '/avatars/avatar8.png',
    totalXP: 600,
    gamesCompleted: 3,
    topSkill: 'Angular',
    skillLevel: 40,
    achievements: 1,
    rank: 8,
    recentActivity: 'Learning Web Development',
  }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const { db } = await connectDB();

    // Initialize leaderboard if empty
    const existingEntries = await db.collection('leaderboard').countDocuments();
    if (existingEntries === 0) {
      await db.collection('leaderboard').insertMany(SAMPLE_LEADERBOARD);
    }

    // Get leaderboard
    const leaderboard = await db.collection('leaderboard')
      .find()
      .sort({ totalXP: -1, gamesCompleted: -1 })
      .limit(10)
      .toArray();

    // Add current user if authenticated
    if (session?.user?.id) {
      // Get user stats for ranking
      const userStats = await db.collection('userProgress').aggregate([
        {
          $match: {
            userId: new ObjectId(session.user.id),
            status: { $in: ['completed', 'mastered'] }
          }
        },
        {
          $group: {
            _id: '$userId',
            totalXP: { $sum: '$xpEarned' },
            gamesCompleted: { $sum: 1 }
          }
        }
      ]).toArray();

      if (userStats.length > 0) {
        // Get top skills
        const userTopSkill = await db.collection('userSkills').findOne(
          { userId: new ObjectId(session.user.id) },
          { sort: { level: -1 } }
        );

        // Get achievements count
        const achievementsCount = await db.collection('userAchievements').countDocuments({
          userId: new ObjectId(session.user.id)
        });

        // Get user's current avatar from the database
        const userProfile = await db.collection('users').findOne(
          { _id: new ObjectId(session.user.id) }
        );

        const userEntry = {
          userId: session.user.id,
          name: session.user.name || 'Anonymous User',
          imageUrl: userProfile?.avatar || '/avatars/avatar1.png',
          totalXP: userStats[0].totalXP,
          gamesCompleted: userStats[0].gamesCompleted,
          topSkill: userTopSkill?.skillName || 'None',
          skillLevel: userTopSkill?.level || 0,
          achievements: achievementsCount,
          isCurrentUser: true
        };

        // Find user's rank
        const userRank = await db.collection('leaderboard').countDocuments({
          totalXP: { $gt: userStats[0].totalXP }
        }) + 1;

        userEntry.rank = userRank;

        // Add user to leaderboard if they're not already in top 10
        if (!leaderboard.some(entry => entry.userId === session.user.id)) {
          leaderboard.push(userEntry);
        }
      }
    }

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
