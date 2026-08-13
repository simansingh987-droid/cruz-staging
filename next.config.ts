import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root. Without this, Turbopack walks up, finds a stray
  // package-lock.json in the home directory, and warns on every build.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
