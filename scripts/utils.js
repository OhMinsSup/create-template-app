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
  const folderPath = path.join(__dirname, `../env/.env.${env}`);
  const filePath = path.join(__dirname, '../.env');
  return {
    safeEnv,
    folderPath,
    filePath,
  };
}

module.exports = {
  parseEnv,
  getEnvironment,
};
