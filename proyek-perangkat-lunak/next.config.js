/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Optimized static generation for landing page
  staticPageGenerationTimeout: 120,
  // Video and image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    unoptimized: false,
  },
  // Exclude backend directory from Next.js build
  webpack: (config, { isServer }) => {
    // Ignore backend directory to prevent Next.js from processing backend files
    config.module.rules.push({
      test: /\.(ts|tsx|js|jsx)$/,
      loader: 'ignore-loader',
      include: [/backend/],
    });
    
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
      };
    }
    return config;
  },
  // Video caching headers
  async headers() {
    return [
      {
        source: '/vids/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'video/mp4',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
