import { type NextResponse } from 'next/server';
import { AppError } from '@/lib/exceptions/AppError';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export function createSuccessResponse<T>(
  data: T,
  meta?: ApiResponse['meta'],
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    { status }
  );
}

export function createErrorResponse(
  error: Error | AppError | unknown,
  status = 500
): NextResponse<ApiResponse> {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: 'INTERNAL_SERVER_ERROR',
        },
      },
      { status }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_SERVER_ERROR',
      },
    },
    { status }
  );
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<ApiResponse<T[]>> {
  return createSuccessResponse(data, {
    page,
    limit,
    total,
    hasMore: page * limit < total,
  });
}
