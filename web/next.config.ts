import type { NextConfig } from "next";
import { defaultSecurityHeaders } from "./src/app/api/_lib/security-headers";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        ...Object.entries(defaultSecurityHeaders).map(([key, value]) => ({ key, value })),
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "img-src 'self' data:",
            "style-src 'self' 'unsafe-inline'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "connect-src 'self' https: http:",
            "font-src 'self' data:",
          ].join('; '),
        },
      ],
    },
  ],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
