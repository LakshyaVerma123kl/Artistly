import type { NextConfig } from "next";

// Ensure environment variables are treated as string literals
const API_PROTOCOL = (process.env.NEXT_PUBLIC_API_PROTOCOL || "https") as
  | "http"
  | "https";
const API_HOSTNAME = (process.env.NEXT_PUBLIC_API_HOSTNAME ||
  "artistly-1jpx.onrender.com") as string;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: API_PROTOCOL,
        hostname: API_HOSTNAME,
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
