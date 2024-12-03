import { NextResponse, Request } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Certificate from '@/lib/models/Certificate';

export const revalidate = 3600; // Revalidate every hour

// GET all certificates
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    // Parse URL to check for featured parameter
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get('featured') === 'true';
    
    // Only fetch non-deleted certificates and convert to plain objects
    const certificates = await Certificate.find({ 
      isDeleted: { $ne: true },
      ...(featuredOnly ? { featured: true } : {})
    })
      .sort({ order: 1, createdAt: -1 })
      .select('-__v') // Exclude version field
      .lean(); // Convert to plain JavaScript objects
    
    // Add cache headers
    const headers = {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    };

    return NextResponse.json(certificates, { headers });
  } catch (error) {
    console.error('Failed to fetch certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}
