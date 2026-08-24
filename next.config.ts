import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  allowedDevOrigins: ['192.168.100.26', 'localhost:4000'],
} as NextConfig;

export default nextConfig;

