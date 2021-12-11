const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const AWS = require('aws-sdk');

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

async function bootstrap() {
  // checked AWS_PROFILE_NAME environment variable is set or not
  if ('AWS_PROFILE_NAME' in process.env) {
    const { AWS_PROFILE_NAME } = process.env;
    if (!AWS_PROFILE_NAME) {
      console.error('AWS_PROFILE_NAME is not defined');
      process.exit(1);
    }
  }

  const { AWS_PROFILE_NAME } = process.env;
  console.log(`AWS_PROFILE_NAME: ${AWS_PROFILE_NAME}`);
  // AWS SDK configuration
  const credentials = new AWS.SharedIniFileCredentials({
    profile: AWS_PROFILE_NAME,
  });

  // validation by AWS_PROFILE_NAME environment variable
  if ([credentials.secretAccessKey, credentials.accessKeyId].some((v) => !v)) {
    console.error('AWS credentials are not defined');
    process.exit(1);
  }

  await exec(`export AWS_PROFILE=${AWS_PROFILE_NAME}`);
  // const list = await spawn('aws', ['configure', 'list']);
  await exec('aws configure list');
  console.log(list);
  process.exit();
}

bootstrap();
