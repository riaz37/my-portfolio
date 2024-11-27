import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { CodeSnippet } from '@/models/CodeSnippet';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code, language, title } = await req.json();
    if (!code || !language || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
    const snippet = await CodeSnippet.create({
      userId: session.user.email,
      code,
      language,
      title,
    });

    return NextResponse.json(snippet);
  } catch (error) {
    console.error('Error saving code snippet:', error);
    return NextResponse.json(
      { error: 'Failed to save code snippet' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    await connectToDatabase();

    if (id) {
      const snippet = await CodeSnippet.findById(id);
      if (!snippet) {
        return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
      }
      if (snippet.userId !== session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.json(snippet);
    }

    const snippets = await CodeSnippet.find({ userId: session.user.email })
      .sort({ createdAt: -1 });
    return NextResponse.json(snippets);
  } catch (error) {
    console.error('Error fetching code snippets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch code snippets' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, code, language, title } = await req.json();
    if (!id || !code || !language || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
    const snippet = await CodeSnippet.findById(id);
    
    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }
    
    if (snippet.userId !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedSnippet = await CodeSnippet.findByIdAndUpdate(
      id,
      { code, language, title },
      { new: true }
    );

    return NextResponse.json(updatedSnippet);
  } catch (error) {
    console.error('Error updating code snippet:', error);
    return NextResponse.json(
      { error: 'Failed to update code snippet' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing snippet ID' }, { status: 400 });
    }

    await connectToDatabase();
    const snippet = await CodeSnippet.findById(id);
    
    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }
    
    if (snippet.userId !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await CodeSnippet.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    console.error('Error deleting code snippet:', error);
    return NextResponse.json(
      { error: 'Failed to delete code snippet' },
      { status: 500 }
    );
  }
}
