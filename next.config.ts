import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.printify.com", pathname: "/**" },
      { protocol: "https", hostname: "printify.com", pathname: "/**" },
      { protocol: "https", hostname: "www.figma.com", pathname: "/api/mcp/asset/**" },
    ],
  },
};

export default nextConfig;
