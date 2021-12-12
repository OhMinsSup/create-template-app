import zlib from 'zlib';
import fs from 'fs';
import dotenv from 'dotenv';
import prettier from 'prettier';
import shell from 'shelljs';
import { buildSitemapForIndex } from './sitemap/main.mjs';
import { buildSitemapForCommon } from './sitemap/common.mjs';
import { buildSitemapForExamples } from './sitemap/examples.mjs';

process.on('unhandledRejection', (err) => {
  throw err;
});

const formatted = (sitemap) => prettier.format(sitemap, { parser: 'html' });

async function buildSitemap() {
  // load by project environment variables
  const env = dotenv.config({
    path: './scripts/env/.env.development',
  });

  if (env.error) {
    console.error(
      `Error: dotenv loaded environment file errors: .env.development`,
      env.error,
    );
    console.log();
    shell.exit(1);
  }

  const getDate = new Date().toISOString();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    await buildSitemapForCommon({
      time: getDate,
      siteUrl,
      formatted,
    });
  } catch (error) {
    console.error(`Error: sitemap.common.mjs`, error);
    shell.exit(1);
  }

  try {
    await buildSitemapForExamples({
      time: getDate,
      siteUrl,
      formatted,
      apiHost:
        'https://60c1a3544f7e880017dbff1f.mockapi.io/posts?limit=10&page=1',
    });
  } catch (error) {
    console.error(`Error: sitemap.examples.mjs`, error);
    shell.exit(1);
  }

  const dir = './public/sitemap';
  fs.readdirSync(dir).forEach((file) => {
    if (file.endsWith('.xml')) {
      const filePath = `${dir}/${file}`;
      const writePath = `${filePath}.gz`;
      // gzip
      const fileContents = fs.createReadStream(filePath);
      const writeStream = fs.createWriteStream(writePath);
      const zip = zlib.createGzip();

      fileContents
        .pipe(zip)
        .on('error', (err) => {
          console.error(err);
          shell.exit(1);
        })
        .pipe(writeStream)
        .on('error', (err) => {
          console.error(err);
          shell.exit(1);
        });
    }
  });

  try {
    await buildSitemapForIndex({
      time: getDate,
      siteUrl,
      formatted,
    });
  } catch (error) {
    console.error(`Error: sitemap.main.mjs`, error);
    shell.exit(1);
  }

  shell.exit();
}

buildSitemap();
