import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{type: 'host', value: 'www.miguelgisbert.dev'}],
        destination: 'https://miguelgisbert.dev/:path*',
        permanent: true,
      },
      {
        source: '/:locale/work/:slug',
        destination: '/:locale#portfolio',
        permanent: true,
      },
      {
        source: '/work/:slug',
        destination: '/en#portfolio',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
