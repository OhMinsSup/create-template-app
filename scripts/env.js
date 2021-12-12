const dotenv = require('dotenv');
const fs = require('fs');
const shell = require('shelljs');
const { getEnvironment } = require('./utils');

process.on('unhandledRejection', (err) => {
  throw err;
});

const { safeEnv, filePath, copyPath } = getEnvironment(process.env.LOAD_ENV);

// load by project environment variables
const env = dotenv.config({
  path: copyPath,
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
fs.copyFileSync(copyPath, filePath);
// success load by project environment variables
shell.echo(`copy: success`);
console.log();
shell.exit();
