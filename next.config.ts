import type { NextConfig } from 'next'
import type { Configuration, RuleSetRule } from 'webpack'

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
  },
  eslint: {
    ignoreDuringBuilds: true, // 👈 Ignore lint errors during Vercel build
  },
  webpack(config: Configuration) {
    const fileLoaderRule = config.module?.rules?.find((rule) => {
      return typeof rule === 'object' && rule.test instanceof RegExp && rule.test.test('.svg')
    }) as RuleSetRule | undefined

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i
    }

    config.module?.rules?.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

export default nextConfig
