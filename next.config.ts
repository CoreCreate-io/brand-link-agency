import type { NextConfig } from 'next';
import type { Configuration, RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config: Configuration) {
    // Find the existing file loader rule for .svg and exclude .svg files from it
    const fileLoaderRule = config.module?.rules?.find((rule): rule is RuleSetRule => {
      return (
        typeof rule === 'object' &&
        rule !== null &&
        rule.test instanceof RegExp &&
        rule.test.test('.svg')
      );
    });

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // Add a new rule to handle .svg files with @svgr/webpack
    config.module?.rules?.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;

export const { projectId, dataset, apiVersion } = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9emdbysj',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01',
};