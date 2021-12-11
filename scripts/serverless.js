const dotenv = require('dotenv');
const fs = require('fs');
const shell = require('shelljs');
const AWS = require('aws-sdk');
const { getEnvironment } = require('./utils');

process.on('unhandledRejection', (err) => {
  throw err;
});

async function bootstrap() {
  const { safeEnv, filePath, folderPath } = getEnvironment(
    process.env.LOAD_ENV,
  );

  // load by project environment variables
  const env = dotenv.config({
    path: folderPath,
  });

  if (env.error) {
    console.error(
      `Error: dotenv loaded environment file errors: .env.${safeEnv}`,
      env.error,
    );
    console.log();
    shell.exit(1);
    return;
  }
  shell.echo(`copy: .env.${safeEnv} ====> .env`);
  // env variables copy for env to root folder .env copy
  fs.copyFileSync(folderPath, filePath);
  // success load by project environment variables
  shell.echo(`copy: success`);
  console.log();

  shell.echo('set environment variables: aws');
  // checked AWS_PROFILE_NAME environment variable is set or not
  if ('AWS_PROFILE_NAME' in process.env) {
    const { AWS_PROFILE_NAME } = process.env;
    if (!AWS_PROFILE_NAME) {
      console.error('Error: "AWS_PROFILE_NAME" is not defined');
      console.log();
      shell.exit(1);
      return;
    }
  }

  const { AWS_PROFILE_NAME } = process.env;

  // AWS SDK configuration
  const credentials = new AWS.SharedIniFileCredentials({
    profile: AWS_PROFILE_NAME,
  });

  // validation by AWS_PROFILE_NAME environment variable
  if ([credentials.secretAccessKey, credentials.accessKeyId].some((v) => !v)) {
    console.error('Error: AWS credentials are not defined');
    console.log();
    shell.exit(1);
    return;
  }

  shell.env['AWS_PROFILE'] = AWS_PROFILE_NAME;
  shell.echo(`set environment variables: success (${AWS_PROFILE_NAME})`);
  console.log();

  shell.echo('remove: .serverless .serverless_nextjs');
  shell.rm('-rf', '.serverless', '.serverless_nextjs');
  shell.echo(`remove: success`);

  // load AWS SDK
  shell.exit();
}

bootstrap();
