export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const getAbsoluteUrl = (path: string) => {
  return `${getBaseUrl()}${path}`;
};

export const getPublicUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL || getBaseUrl()}${path}`;
};
