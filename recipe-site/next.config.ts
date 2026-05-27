import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  images: {
    // In dev the API runs on http://localhost:3000 which resolves to ::1 — Next 16
    // refuses to optimize images from private IPs by default. Only opt in for dev.
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "*.onrender.com" },
    ],
  },
};

export default nextConfig;
