/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
      {
        source: '/skills',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/skill',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/tools',
        destination: '/tools/system-prompt-builder',
        permanent: true,
      },
      {
        source: '/tool',
        destination: '/tools/system-prompt-builder',
        permanent: true,
      },
      {
        source: '/quiz',
        destination: '/learn/quiz',
        permanent: true,
      },
      {
        source: '/arena',
        destination: '/compare',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
