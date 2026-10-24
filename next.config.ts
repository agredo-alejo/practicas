import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Portfolio routes are prerendered at build time; the archive is served as static files.
  trailingSlash: true,
};

export default nextConfig;
