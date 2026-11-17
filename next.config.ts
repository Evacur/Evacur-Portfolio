import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Umami servi depuis le domaine du site : les bloqueurs de publicité bloquent cloud.umami.is en tiers.
  async rewrites() {
    return [
      { source: "/pc-stats/script.js", destination: "https://cloud.umami.is/script.js" },
      { source: "/pc-stats/api/send", destination: "https://gateway.umami.is/api/send" },
    ];
  },
};

export default nextConfig;
