/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  experimental: {
    instrumentationHook: false, // Disabled temporarily due to edge runtime issues with Winston logger
  },
  typescript: {
    // Enforce TypeScript type checking in builds
    ignoreBuildErrors: false,
  },
  eslint: {
    // Enforce ESLint checking in builds
    ignoreDuringBuilds: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

}

const withMDX = require('@next/mdx')({
  options: {
    remarkPlugins: [require('remark-gfm')],
    rehypePlugins: [
      require('rehype-slug'),
      require('rehype-highlight'),
      [require('rehype-autolink-headings'), { behavior: 'wrap' }],
    ],
  },
})

module.exports = withMDX(nextConfig)
