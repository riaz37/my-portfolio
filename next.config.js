/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'api.dicebear.com',
      'github.com',
      'raw.githubusercontent.com',
      'github-readme-stats.vercel.app',
      'github-readme-streak-stats.herokuapp.com',
      'imgs.search.brave.com'
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Environment variables exposed to the client
  env: {
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'dix3m5mmi',
  },
  
  // Build optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Webpack configuration for MongoDB
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        child_process: false,
        aws4: false,
        'timers/promises': false,
        timers: require.resolve('timers-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        buffer: require.resolve('buffer/'),
        crypto: require.resolve('crypto-browserify'),
      };

      const webpack = require('webpack');
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }
    return config;
  },
}

module.exports = nextConfig
