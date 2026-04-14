import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Firebase Hosting SSR 対応
  output: "standalone",
};

export default nextConfig;
