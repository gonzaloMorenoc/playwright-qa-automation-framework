const { defineConfig } = require('@playwright/test');
const baseConfig = require('./environments/base.config.js');

module.exports = defineConfig({
  ...baseConfig,
  projects: [
    {
      name: 'chromium',
      use: { ...baseConfig.use, browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { ...baseConfig.use, browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { ...baseConfig.use, browserName: 'webkit' },
    },
  ],
});