import type { NextConfig } from "next";
import path from "path";

// Nest API (default 4000). Override in .env: BACKEND_INTERNAL_URL=http://127.0.0.1:4000
const backend = (process.env.BACKEND_INTERNAL_URL ?? "http://127.0.0.1:4000").replace(/\/$/, "");
const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
