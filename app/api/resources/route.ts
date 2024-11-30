import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Resource } from '@/models/Resource';

// GET all resources
export async function GET() {
  try {
    await connectToDatabase();
    const resources = await Resource.find().sort({ createdAt: -1 });
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST new resource
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, description, category, imageUrl, resourceType, link, resourceUrl } = data;

    // Validate required fields
    if (!title || !description || !category || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate resource type and corresponding fields
    if (!['link', 'document', 'video'].includes(resourceType)) {
      return NextResponse.json(
        { error: 'Invalid resource type' },
        { status: 400 }
      );
    }

    if (resourceType === 'link' && !link) {
      return NextResponse.json(
        { error: 'Link is required for link type resources' },
        { status: 400 }
      );
    }

    if ((resourceType === 'document' || resourceType === 'video') && !resourceUrl) {
      return NextResponse.json(
        { error: `Resource URL is required for ${resourceType} type resources` },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Create resource
    const resource = await Resource.create({
      title,
      description,
      category,
      imageUrl,
      resourceType,
      link: resourceType === 'link' ? link : undefined,
      resourceUrl: ['document', 'video'].includes(resourceType) ? resourceUrl : undefined,
      createdBy: session.user.id,
      createdAt: new Date(),
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    await Resource.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
