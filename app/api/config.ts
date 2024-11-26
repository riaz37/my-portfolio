import { type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function withAuth(
  req: NextRequest,
  handler: (session: Awaited<ReturnType<typeof getServerSession>>) => Promise<Response>
) {
  try {
    const session = await getServerSession(authOptions satisfies AuthOptions);
    if (!session) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return handler(session);
  } catch (error) {
    console.error('Auth error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function withErrorHandler(
  handler: () => Promise<Response>
): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export function createApiResponse<T>(
  data: T,
  message?: string,
  status = 200
): Response {
  return Response.json(
    { success: true, data, message },
    { status }
  );
}

export function createErrorResponse(
  error: string,
  status = 400
): Response {
  return Response.json(
    { success: false, error },
    { status }
  );
}
