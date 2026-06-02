import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:8000/api/:path*",
    },
    {
      source: "/videos/:path*",
      destination: "http://localhost:8000/videos/:path*",
    },
    {
      source: "/thumbnails/:path*",
      destination: "http://localhost:8000/thumbnails/:path*",
    },
    {
      source: "/gallery/:path*",
      destination: "http://localhost:8000/gallery/:path*",
    },
    {
      source: "/video/:path*",
      destination: "http://localhost:8000/video/:path*",
    },
    {
      source: "/render/:path*",
      destination: "http://localhost:3100/render/:path*",
    },
  ],
};

export default nextConfig;
