import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "randomuser.me",
      },
      {
        hostname: "deifkwefumgah.cloudfront.net",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "miro.medium.com",
      },
    ],
  },
};

export default nextConfig;
