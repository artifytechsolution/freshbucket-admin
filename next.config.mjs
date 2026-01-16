/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  typescript: {
    // ⚠️ Allows production builds even if there are type errors
    ignoreBuildErrors: true,
  },

  eslint: {
    // Skip ESLint checks during production build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
