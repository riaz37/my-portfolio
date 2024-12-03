import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import Certificate from '@/lib/models/Certificate';
import { validateAdminAccess } from '@/lib/auth/admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    
    const data = await request.json();
    const validatedData = certificateSchema.partial().parse(data);

    const certificate = await Certificate.findByIdAndUpdate(
      params.id,
      { 
        ...validatedData, 
        updatedBy: session.user.id,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error updating certificate:', error);
    if (error instanceof z.ZodError) {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();

    const certificate = await Certificate.findByIdAndUpdate(
      params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Certificate deleted successfully',
      data: certificate 
    });
  } catch (error) {
    console.error('Error deleting certificate:', error);
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
