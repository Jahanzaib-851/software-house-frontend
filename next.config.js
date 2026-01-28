/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Double renders ko rokna development speed ke liye best hai
  reactStrictMode: false,

  // 2. Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
    ],
  },

  // 3. Experimental features (Turbopack optimization)
  experimental: {
    // Note: swcMinify yahan likhne ki zaroorat nahi, Next.js 15 isay khud handle karta hai
    turbo: {
      // Custom aliases agar zaroorat ho
    },
  },

  // 4. Build speed ko fast karne ke liye
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;