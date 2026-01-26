import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loja-ia-backend.onrender.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
