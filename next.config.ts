import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect removed /ko/* routes to JA equivalents (SEO preservation)
      {
        source: "/ko/:path*",
        destination: "/:path*",
        permanent: true,
      },
      // Redirect removed /zh/* routes to JA equivalents
      {
        source: "/zh/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
