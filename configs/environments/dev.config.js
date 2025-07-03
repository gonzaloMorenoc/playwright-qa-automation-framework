const { defineConfig } = require('@playwright/test');
const baseConfig = require('./base.config.js');

module.exports = defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: 'https://wordmate.es/dev',
  },
});