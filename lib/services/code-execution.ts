import { connectDB } from "@/lib/db/mongodb";
import { ObjectId } from 'mongodb';

const PISTON_API_URL = process.env.NEXT_PUBLIC_PISTON_API_URL || 'https://emkc.org/api/v2/piston';

interface ExecutionResult {
  output: string;
  error?: string;
  language: string;
  version: string;
  ran: boolean;
  stdout: string;
  stderr: string;
}

export interface CodeSnippet {
  _id?: ObjectId;
  userId: string;
  code: string;
  language: string;
  title: string;
  createdAt: Date;
}

const languageConfigs = {
  javascript: {
    language: 'javascript',
    version: '18.15.0',
    files: [{ content: '' }],
  },
  typescript: {
    language: 'typescript',
    version: '5.0.0',
    files: [{ content: '' }],
  },
  python: {
    language: 'python',
    version: '3.10.0',
    files: [{ content: '' }],
  },
  html: {
    language: 'html',
    version: 'latest',
    files: [{ content: '' }],
  },
  css: {
    language: 'css',
    version: 'latest',
    files: [{ content: '' }],
  },
} as const;

type SupportedLanguage = keyof typeof languageConfigs;

// Cache for API responses
const apiCache = new Map<string, { result: ExecutionResult; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function executeCode(code: string, language: string): Promise<ExecutionResult> {
  if (!code.trim()) {
    return {
      output: '',
      error: 'No code to execute',
      language,
      version: '',
      ran: false,
      stdout: '',
      stderr: '',
    };
  }

  // Generate cache key
  const cacheKey = `${language}:${code}`;
  const cachedResult = apiCache.get(cacheKey);
  
  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
    return cachedResult.result;
  }

  try {
    const config = languageConfigs[language as SupportedLanguage];
    if (!config) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const requestBody = {
      ...config,
      files: [{ content: code }],
    };

    const response = await fetch(`${PISTON_API_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', { status: response.status, error: errorText });
      throw new Error(`Execution failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    const executionResult: ExecutionResult = {
      output: result.run?.output || '',
      language: result.language || language,
      version: result.version || '',
      ran: result.run?.ran || false,
      stdout: result.run?.stdout || '',
      stderr: result.run?.stderr || '',
      error: result.run?.stderr ? result.run.stderr : undefined,
    };

    // Cache the result
    apiCache.set(cacheKey, {
      result: executionResult,
      timestamp: Date.now(),
    });

    return executionResult;
  } catch (error) {
    console.error('Code execution error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to execute code');
  }
}

// Save code snippet to database
export async function saveCodeSnippet(
  userId: string,
  code: string,
  language: string,
  title: string
): Promise<void> {
  const db = await connectDB();
  
  try {
    await db.collection('snippets').insertOne({
      userId,
      code,
      language,
      title: title.trim(),
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error saving snippet:', error);
    throw new Error('Failed to save code snippet');
  }
}

// Get user's saved code snippets
export async function getUserSnippets(userId: string): Promise<CodeSnippet[]> {
  const db = await connectDB();
  
  try {
    const snippets = await db
      .collection('snippets')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return snippets.map(snippet => ({
      ...snippet,
      id: snippet._id.toString(),
      created_at: snippet.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching snippets:', error);
    throw new Error('Failed to fetch code snippets');
  }
}

// Get a specific code snippet
export async function getSnippetById(id: string): Promise<CodeSnippet | null> {
  try {
    const db = await connectDB();
    const collection = db.collection('snippets');
    const objectId = new ObjectId(id);
    const snippet = await collection.findOne({ _id: objectId });

    if (!snippet) {
      return null;
    }

    return {
      ...snippet,
      id: snippet._id.toString(),
      created_at: snippet.createdAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching snippet:', error);
    throw new Error('Failed to fetch code snippet');
  }
}

// Update a code snippet
export async function updateSnippet(
  id: string,
  updates: Partial<Omit<CodeSnippet, '_id' | 'userId'>>
): Promise<void> {
  try {
    const db = await connectDB();
    const collection = db.collection('snippets');
    const objectId = new ObjectId(id);

    await collection.updateOne(
      { _id: objectId },
      { $set: updates }
    );
  } catch (error) {
    console.error('Error updating snippet:', error);
    throw new Error('Failed to update code snippet');
  }
}

// Delete a code snippet
export async function deleteSnippet(id: string): Promise<void> {
  try {
    const db = await connectDB();
    const collection = db.collection('snippets');
    const objectId = new ObjectId(id);

    await collection.deleteOne({ _id: objectId });
  } catch (error) {
    console.error('Error deleting snippet:', error);
    throw new Error('Failed to delete code snippet');
  }
}
