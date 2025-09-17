/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/sspmcoe-mess',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;


