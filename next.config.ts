import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Development Configuration
  logging: {
    browserToTerminal: "error",
  },
  reactStrictMode: true,
};

export default nextConfig;
