interface Options {
  interval: number;
  uniqueTokenPerInterval: number;
}

interface RateLimiter {
  check: (limit: number, token: string) => Promise<void>;
}

export function rateLimit(options: Options): RateLimiter {
  const tokenCache = new Map();

  return {
    check: (limit: number, token: string): Promise<void> => {
      const now = Date.now();
      const windowStart = now - options.interval;
      
      const tokenKey = `${token}:${Math.floor(now / options.interval)}`;
      const tokenCount = tokenCache.get(tokenKey) || 0;

      if (tokenCount >= limit) {
        return Promise.reject(new Error('Rate limit exceeded'));
      }

      // Clean old entries
      for (const [key, timestamp] of tokenCache.entries()) {
        if (timestamp <= windowStart) {
          tokenCache.delete(key);
        }
      }

      tokenCache.set(tokenKey, tokenCount + 1);

      // Ensure cache doesn't grow too large
      if (tokenCache.size > options.uniqueTokenPerInterval) {
        const oldestKey = tokenCache.keys().next().value;
        tokenCache.delete(oldestKey);
      }

      return Promise.resolve();
    },
  };
}
