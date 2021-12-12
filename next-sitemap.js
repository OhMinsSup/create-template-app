module.exports = {
  siteUrl: 'https://d2rddspxunnkn4.cloudfront.net',
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  // exclude: [],
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
