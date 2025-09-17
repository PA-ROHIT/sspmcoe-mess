/** @type {import(&apos;next&apos;).NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: &apos;2mb&apos;
    }
  },
  images: {
    remotePatterns: [
      { protocol: &apos;https&apos;, hostname: &apos;**&apos; }
    ]
  }
};

export default nextConfig;


