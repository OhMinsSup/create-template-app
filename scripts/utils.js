const path = require('path');

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

function getEnvironment(env) {
  const safeEnv = parseEnv(env);
  const copyPath = path.join(__dirname, `./env/.env.${env}`);
  const filePath = path.join(__dirname, '../.env');
  return {
    safeEnv,
    copyPath,
    filePath,
  };
}

function getServerlessYml(env) {
  const filename = `serverless.${env}.yml`;
  const copyPath = path.join(__dirname, `./setting/${filename}`);
  const filePath = path.join(__dirname, '../serverless.yml');
  return {
    filename,
    copyPath,
    filePath,
  };
}

module.exports = {
  parseEnv,
  getEnvironment,
  getServerlessYml,
};
