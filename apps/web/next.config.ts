import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@gitrats/shared", "@gitrats/ui"],

  // Enable SSR optimizations
  experimental: {
    optimizePackageImports: ["@gitrats/ui"],
  },

  // API proxy to NestJS backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
