import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Blog } from '@/lib/models/Blog';
import { startOfMonth, subMonths, format } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Get total views
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    // Get views trend for last 6 months
    const sixMonthsAgo = subMonths(new Date(), 6);
    const viewsTrend = await Blog.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: '$views' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Format trend data
    const trend = viewsTrend.map(item => ({
      date: format(new Date(item._id.year, item._id.month - 1), 'MMM yyyy'),
      count: item.count
    }));

    // Get popular posts
    const popularPosts = await Blog.find()
      .sort({ views: -1 })
      .limit(5)
      .select('title views');

    // Get tag statistics
    const tagStats = await Blog.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get category statistics
    const categoryStats = await Blog.aggregate([
      { $unwind: '$categories' },
      {
        $group: {
          _id: '$categories',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Calculate average read time (assuming 200 words per minute)
    const readTimeStats = await Blog.aggregate([
      {
        $project: {
          wordCount: {
            $size: {
              $split: [
                { $ifNull: ['$content', ''] },
                ' '
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          avgWordCount: { $avg: '$wordCount' }
        }
      }
    ]);

    const averageReadTime = Math.ceil((readTimeStats[0]?.avgWordCount || 0) / 200);

    // Get engagement metrics
    const totalLikes = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: '$likes' } } }
    ]);

    const analyticsData = {
      views: {
        total: totalViews[0]?.total || 0,
        trend
      },
      engagement: {
        averageReadTime,
        completionRate: 65, // This would need to be calculated based on actual scroll depth tracking
        likes: totalLikes[0]?.total || 0
      },
      popular: {
        posts: popularPosts.map(post => ({
          title: post.title,
          views: post.views
        })),
        tags: tagStats.map(tag => ({
          name: tag._id,
          count: tag.count
        })),
        categories: categoryStats.map(category => ({
          name: category._id,
          count: category.count
        }))
      }
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching blog analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog analytics' },
      { status: 500 }
    );
  }
}
