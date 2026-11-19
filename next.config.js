/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
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
