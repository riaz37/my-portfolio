import { NextRequest } from 'next/server';
import { RateLimitError } from '@/lib/exceptions/AppError';

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per interval
}

const defaultConfig: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
};

const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

export function configureRateLimit(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };

  return async function rateLimit(req: NextRequest) {
    const ip = req.ip || 'unknown';
    const now = Date.now();

    const requestData = ipRequestMap.get(ip) || {
      count: 0,
      resetTime: now + finalConfig.interval,
    };

    // Reset if the interval has passed
    if (now > requestData.resetTime) {
      requestData.count = 0;
      requestData.resetTime = now + finalConfig.interval;
    }

    requestData.count++;
    ipRequestMap.set(ip, requestData);

    const remaining = finalConfig.maxRequests - requestData.count;
    const reset = Math.ceil((requestData.resetTime - now) / 1000);

    if (requestData.count > finalConfig.maxRequests) {
      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${reset} seconds.`
      );
    }

    return {
      remaining,
      reset,
      success: true,
    };
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestMap.entries()) {
    if (now > data.resetTime) {
      ipRequestMap.delete(ip);
    }
  }
}, 60 * 1000); // Clean up every minute

// Example usage:
// const rateLimiter = configureRateLimit({ maxRequests: 100, interval: 60 * 1000 });
// try {
//   await rateLimiter(req);
//   // Handle request
// } catch (error) {
//   if (error instanceof RateLimitError) {
//     return createErrorResponse(error);
//   }
//   throw error;
// }
