import type { NextConfig } from "next";

// Every page is pre-rendered under /en/... and /vi/... (see src/app/[lang]).
// Visitors keep clean URLs: these rewrites serve the version matching the `lang`
// cookie (set by the language switcher), defaulting to English. Paths that
// already carry a language prefix are left alone.
const UNPREFIXED = "/:path((?!en(?:/|$)|vi(?:/|$)).+)";
const viCookie = [{ type: "cookie" as const, key: "lang", value: "vi" }];

const nextConfig: NextConfig = {
  images: {
    // Recipe photos are either committed to public/uploads/ or linked from any https host
    // (Google Drive photos are served from lh3.googleusercontent.com — see lib/image.ts).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/", has: viCookie, destination: "/vi" },
        { source: "/", destination: "/en" },
        { source: UNPREFIXED, has: viCookie, destination: "/vi/:path" },
        { source: UNPREFIXED, destination: "/en/:path" },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
