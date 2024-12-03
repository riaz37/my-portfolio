import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Certificate from '@/lib/models/Certificate';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch ALL certificates for debugging
    const allCertificates = await Certificate.find({})
      .select('-__v') // Exclude version field
      .lean(); // Convert to plain JavaScript objects

    // Fetch non-deleted certificates
    const nonDeletedCertificates = await Certificate.find({ isDeleted: false })
      .select('-__v')
      .lean();

    // Fetch featured certificates
    const featuredCertificates = await Certificate.find({ 
      isDeleted: false, 
      featured: true 
    })
      .select('-__v')
      .lean();

    return NextResponse.json({
      message: 'Debug information for certificates',
      allCertificatesCount: allCertificates.length,
      nonDeletedCertificatesCount: nonDeletedCertificates.length,
      featuredCertificatesCount: featuredCertificates.length,
      allCertificates,
      nonDeletedCertificates,
      featuredCertificates
    });
  } catch (error) {
    console.error('Failed to fetch debug certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debug certificates', details: error.message },
      { status: 500 }
    );
  }
}
