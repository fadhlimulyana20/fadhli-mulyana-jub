import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bundui-images.netlify.app',
      },
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
      },
    ],
  },
};

export default nextConfig;
