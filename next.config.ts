import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "*.soriavps.cloud",
      },
      {
        protocol: "https",
        hostname: "pub-089bceecfe7a4a70974b085d5ee0f0d2.r2.dev",
      },
    ],
  },
};

export default nextConfig;
