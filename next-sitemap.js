module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: [
    '/html/*',
    '/art/[*]/histories/*',
    '/art/[*]/offer/*',
    '/art/[*]/sale/*',
    '/art/regist',
    '/creator/regist',
    '/find-email/*',
    '/find-password/*',
    '/payment/*',
    '/email-verification',
    '/myinfo_modify',
    '/pay-complete',
    '/login',
    '/signup',
    '/404',
  ],
  // Default transformation function
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'Baiduspider',
        disallow: '/',
      },
    ],
  },
};
