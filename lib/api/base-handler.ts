import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/utils/logger';
import { createSuccessResponse, createErrorResponse } from '@/lib/api/response';
import { configureRateLimit } from '@/lib/api/rate-limit';
import { AppError, ValidationError } from '@/lib/exceptions/AppError';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface HandlerConfig {
  method: HttpMethod;
  schema?: z.ZodTypeAny;
  requireAuth?: boolean;
  rateLimit?: {
    maxRequests: number;
    interval: number;
  };
}

export interface ApiContext {
  req: NextRequest;
  params: Record<string, string>;
  searchParams: URLSearchParams;
  session?: any;
}

type ApiHandler = (context: ApiContext) => Promise<Response>;

export function createApiHandler(config: HandlerConfig, handler: ApiHandler) {
  return async function (req: NextRequest, context: { params: Record<string, string> }) {
    const startTime = Date.now();
    
    try {
      // Method check
      if (req.method !== config.method) {
        return createErrorResponse(
          new AppError(`Method ${req.method} not allowed`, 405, 'METHOD_NOT_ALLOWED')
        );
      }

      // Rate limiting
      if (config.rateLimit) {
        const rateLimiter = configureRateLimit(config.rateLimit);
        await rateLimiter(req);
      }

      // Parse search params
      const searchParams = req.nextUrl.searchParams;

      // Validate request body if schema provided
      let validatedBody;
      if (config.schema) {
        try {
          const body = await req.json();
          validatedBody = config.schema.parse(body);
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new ValidationError(error.errors[0].message);
          }
          throw error;
        }
      }

      // Create context
      const apiContext: ApiContext = {
        req: Object.assign(req, { validatedBody }),
        params: context.params,
        searchParams,
      };

      // Execute handler
      const response = await handler(apiContext);

      // Log successful request
      const duration = Date.now() - startTime;
      logger.info('API Request completed', {
        method: req.method,
        path: req.nextUrl.pathname,
        duration,
        status: response.status,
      });

      return response;

    } catch (error) {
      // Log error
      const duration = Date.now() - startTime;
      logger.error('API Request failed', {
        method: req.method,
        path: req.nextUrl.pathname,
        duration,
        error,
      });

      return createErrorResponse(error);
    }
  };
}

// Example usage:
/*
export const GET = createApiHandler(
  {
    method: 'GET',
    schema: z.object({
      id: z.string(),
    }),
    rateLimit: {
      maxRequests: 100,
      interval: 60 * 1000,
    },
  },
  async ({ req, params, searchParams }) => {
    const data = await someService.getData(params.id);
    return createSuccessResponse(data);
  }
);
*/
