import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow API routes to run for up to 5 minutes
  experimental: {
    maxDuration: 300,
  },
};

export default nextConfig;
