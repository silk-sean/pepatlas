import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces .next/standalone — required by our Dockerfile for a slim runtime image
  output: "standalone",
};

export default nextConfig;
