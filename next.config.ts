import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
   typescript: {
    // !! WARN !!
    // This will allow production builds even if there are type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint checks during production build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
