import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/models/auth';
import mongoose from 'mongoose';

// Define a schema for the expected stats response
const statsSchema = z.object({
  posts: z.number().min(0),
  projects: z.number().min(0),
  testimonials: z.number().min(0),
  games: z.number().min(0),
  views: z.number().min(0),
  likes: z.number().min(0),
});

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Verify admin status
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Get counts from different collections
    const [
      postsCount,
      projectsCount,
      testimonialsCount,
      gamesCount,
      analyticsDoc
    ] = await Promise.all([
      mongoose.connection.db.collection('posts').countDocuments({ isDeleted: false }).catch(() => 0),
      mongoose.connection.db.collection('projects').countDocuments({ isDeleted: false }).catch(() => 0),
      mongoose.connection.db.collection('testimonials').countDocuments({ isDeleted: false }).catch(() => 0),
      mongoose.connection.db.collection('playground').countDocuments({ isDeleted: false }).catch(() => 0),
      mongoose.connection.db.collection('analytics').findOne({ _id: 'global' }).catch(() => null)
    ]);

    // Prepare stats object
    const stats = {
      posts: postsCount,
      projects: projectsCount,
      testimonials: testimonialsCount,
      games: gamesCount,
      views: analyticsDoc?.views || 0,
      likes: analyticsDoc?.likes || 0,
    };

    // Validate stats using Zod
    const validatedStats = statsSchema.parse(stats);

    // Log the counts for debugging
    console.log('Admin Stats:', validatedStats);

    return NextResponse.json(validatedStats);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid stats data', 
          details: error.errors 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
