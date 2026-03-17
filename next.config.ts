import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.printify.com", pathname: "/**" },
      { protocol: "https", hostname: "printify.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
