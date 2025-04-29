import type { NextConfig } from 'next'
import type { Configuration, RuleSetRule } from 'webpack'

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
  },
  eslint: {
    ignoreDuringBuilds: true,
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
      fileLoaderRule.exclude = /\.svg$/i;
    }

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