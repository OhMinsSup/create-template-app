const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

process.on('unhandledRejection', (err) => {
  throw err;
});

function parseEnv(env) {
  switch (env) {
    case 'development':
      return 'development';
    case 'production':
      return 'production';
    case 'local':
      return 'local';
    case 'analyze':
      return 'local.analyze';
    case 'debug':
      return 'local.debug';
    default:
      throw new Error(`Unknown environment: ${env}`);
  }
}

const loadEnv = parseEnv(process.env.LOAD_ENV);
const envFolderFilePath = path.join(__dirname, `../env/.env.${loadEnv}`);
const envFilePath = path.join(__dirname, '../.env');

// load by project environment variables
const env = dotenv.config({
  path: envFolderFilePath,
});

if (env.error) {
  console.error(`dotenv loaded environment file errors: .env.${loadEnv}`);
  console.error(env.error);
  process.exit(1);
}

fs.copyFileSync(envFolderFilePath, envFilePath);
// success load by project environment variables
console.log(`success copy by ".env.${loadEnv}" environment variables`);
process.exit();
