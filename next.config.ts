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
}

export default nextConfig
