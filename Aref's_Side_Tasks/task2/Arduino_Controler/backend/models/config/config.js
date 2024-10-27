const fs = require('fs');
const path = require('path');
const toml = require('toml');

// Load configuration
const configPath = path.join(__dirname, 'config.toml');

let config;
try {
  const configFileContent = fs.readFileSync(configPath, 'utf8');
  config = toml.parse(configFileContent);
//   console.log('Configuration loaded:', config);
} catch (error) {
  console.error('Failed to load configuration:', error.message);
  process.exit(1);
}

module.exports = config;
