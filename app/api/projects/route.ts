import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Project from '@/lib/db/models/Project';

export const revalidate = 3600; // Revalidate every hour

// GET all projects
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    // Parse URL to check for featured parameter
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get('featured') === 'true';
    
    // Only fetch non-deleted projects and convert to plain objects
    const projects = await Project.find({ 
      isDeleted: { $ne: true },
      ...(featuredOnly ? { featured: true } : {})
    })
      .sort({ order: 1, createdAt: -1 })
      .select('-__v') // Exclude version field
      .lean(); // Convert to plain JavaScript objects
    
    // If no projects found and not specifically looking for featured, return all projects
    if (projects.length === 0 && featuredOnly) {
      const allProjects = await Project.find({ 
        isDeleted: { $ne: true }
      })
        .sort({ order: 1, createdAt: -1 })
        .select('-__v')
        .lean();
      
      console.log('No featured projects, returning all projects');
      
      return NextResponse.json(allProjects, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        }
      });
    }
    
    // Add cache headers
    const headers = {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    };

    return NextResponse.json(projects, { headers });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
