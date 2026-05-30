/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['localhost'],
  },
  transpilePackages: ['lucide-react'],
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
