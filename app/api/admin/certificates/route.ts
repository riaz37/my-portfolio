import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import Certificate from '@/lib/models/Certificate';
import { validateAdminAccess } from '@/lib/auth/admin';

const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    { message: 'Invalid issue date' }
  ),
  expiryDate: z.string().optional().refine(
    (date) => !date || !isNaN(Date.parse(date)),
    { message: 'Invalid expiry date' }
  ),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().min(1, 'Image URL is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  skills: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    
    const certificates = await Certificate.find({ isDeleted: false })
      .sort({ createdAt: -1 });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    
    const data = await request.json();
    console.log('Received certificate data:', data); // Debug log

    const validatedData = certificateSchema.parse(data);
    console.log('Validated certificate data:', validatedData); // Debug log

    const certificate = await Certificate.create({
      ...validatedData,
      createdBy: session.user.id,
      isDeleted: false
    });

    console.log('Created certificate:', certificate); // Debug log

    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error creating certificate:', error);
    if (error instanceof z.ZodError) {
      console.error('Zod validation errors:', error.errors); // Additional debug log
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: error.errors 
        },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
