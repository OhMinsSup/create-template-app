const path = require('path');
const withNextEnv = require('next-env');
const { withPlugins } = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * Next Config Options
 * @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   outputStandalone: true,
  // },

  swcMinify: true,

  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: [
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // * 이용자에게 제공되는 헤더에 nextjs 로 개발되었음을 노출하지 않습니다.
  poweredByHeader: false,

  // * 주소 뒤에 슬래시를 붙일지 여부입니다.
  trailingSlash: true,

  // experimental: { granularChunks: true },

  // images: {
  //   domains: [], // 외부 웹사이트 이미지인경우, 이미지 src 의 도메인을 옵션에 명시
  // },

  // https://nextjs.org/docs/basic-features/built-in-css-support#sass-support
  sassOptions: {
    // scss module 설정
    includePaths: [path.resolve(__dirname, 'node_modules')],
  },

  // * CDN 을 설정하려면 자산 접두사를 설정하고 Next.js가 호스팅되는 도메인으로 확인되도록 CDN의 출처를 구성이 가능합니다.
  // https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
  // assetPrefix: process.env.NEXT_PUBLIC_SITE_URL,

  // * Next.js는 렌더링 된 콘텐츠와 정적 파일을 압축하기 위해 gzip 압축을 제공합니다.
  // https://nextjs.org/docs/api-reference/next.config.js/compression
  compress: true,

  webpack: (config, { dev, webpack }) => {
    // * 개발 중 사용될 웹팩 설정입니다.
    if (dev) {
      // * HMR 시 CPU 사용량을 줄이는 빌드 최적화 코드
      config.watchOptions.poll = 1000;
      config.watchOptions.aggregateTimeout = 300;
      config.mode = 'development';
      config.devtool = 'eval-source-map';
    } else {
      config.mode = 'production';
      config.devtool = 'hidden-source-map';
    }

    return {
      ...config,
      plugins: [
        ...config.plugins,
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ko|es-us/),
      ],
    };
  },

  // productionBrowserSourceMaps: true,
};

const composeEnhancers = [withNextEnv, withBundleAnalyzer];

module.exports = withPlugins(composeEnhancers, nextConfig);
