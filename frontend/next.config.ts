import type { NextConfig } from "next";

const nextConfig: any = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loja-ia-backend.onrender.com',
        pathname: '/media/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;