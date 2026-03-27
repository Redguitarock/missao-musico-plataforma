import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* No more webpack-only config without turbopack ack */
  turbopack: {}, 
};

export default nextConfig;
