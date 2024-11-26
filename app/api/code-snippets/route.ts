import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  saveCodeSnippet,
  getUserSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
} from '@/lib/services/mongodb-service';

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

    const result = await saveCodeSnippet(session.user.email, code, language, title);
    return NextResponse.json(result);
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

    if (id) {
      const snippet = await getSnippetById(id);
      if (!snippet) {
        return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
      }
      if (snippet.userId !== session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.json(snippet);
    }

    const snippets = await getUserSnippets(session.user.email);
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

    const { id, ...updates } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing snippet ID' }, { status: 400 });
    }

    const snippet = await getSnippetById(id);
    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }
    if (snippet.userId !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await updateSnippet(id, updates);
    return NextResponse.json(result);
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

    const snippet = await getSnippetById(id);
    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }
    if (snippet.userId !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await deleteSnippet(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting code snippet:', error);
    return NextResponse.json(
      { error: 'Failed to delete code snippet' },
      { status: 500 }
    );
  }
}
