export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const getAbsoluteUrl = (path: string) => {
  return `${getBaseUrl()}${path}`;
};

export const getPublicUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL || getBaseUrl()}${path}`;
};
