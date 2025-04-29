import type { NextConfig } from 'next';
import type { Configuration, RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.sanity.io'], // Allow images from Sanity's CDN
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during builds
  },
  webpack(config: Configuration) {
    const fileLoaderRule = config.module?.rules?.find((rule): rule is RuleSetRule => {
      return (
        typeof rule === 'object' &&
        rule !== null &&
        rule.test instanceof RegExp &&
        rule.test.test('.svg')
      );
    });

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i; // Exclude SVGs from the default file loader
    }

    config.module?.rules?.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'], // Use @svgr/webpack for SVGs
    });

    return config;
  },
};

export default nextConfig;