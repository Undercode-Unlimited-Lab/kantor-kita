import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disabling strict mode prevents duplicate canvas mounting in dev
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app']
    }
  }
};

export default nextConfig;
