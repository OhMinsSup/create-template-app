const dotenv = require('dotenv');
const fs = require('fs');
const shell = require('shelljs');
const { getEnvironment } = require('./utils');

process.on('unhandledRejection', (err) => {
  throw err;
});

const { safeEnv, filePath, folderPath } = getEnvironment(process.env.LOAD_ENV);

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

// env variables copy for env to root folder .env copy
fs.copyFileSync(folderPath, filePath);
// success load by project environment variables
shell.echo(`✨ success copy by ".env.${safeEnv}" environment variables`);
console.log();
shell.exit();
