import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Get counts from different collections
    const [
      postsCount,
      projectsCount,
      testimonialsCount,
      gamesCount,
      analyticsDoc
    ] = await Promise.all([
      mongoose.connection.db.collection('posts').countDocuments().catch(() => 0),
      mongoose.connection.db.collection('projects').countDocuments().catch(() => 0),
      mongoose.connection.db.collection('testimonials').countDocuments().catch(() => 0),
      mongoose.connection.db.collection('playground').countDocuments().catch(() => 0),
      mongoose.connection.db.collection('analytics').findOne({ _id: 'global' }).catch(() => null)
    ]);

    // Log the counts for debugging
    console.log('Stats:', {
      posts: postsCount,
      projects: projectsCount,
      testimonials: testimonialsCount,
      games: gamesCount,
      views: analyticsDoc?.views || 0,
      likes: analyticsDoc?.likes || 0
    });

    return NextResponse.json({
      posts: postsCount,
      projects: projectsCount,
      testimonials: testimonialsCount,
      games: gamesCount,
      views: analyticsDoc?.views || 0,
      likes: analyticsDoc?.likes || 0,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
