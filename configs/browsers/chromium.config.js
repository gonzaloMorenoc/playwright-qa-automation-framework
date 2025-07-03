const { defineConfig } = require('@playwright/test');
const baseConfig = require('../environments/base.config.js');

module.exports = defineConfig({
  ...baseConfig,
  projects: [
    {
      name: 'chromium',
      use: {
        ...baseConfig.use,
        browserName: 'chromium',
        // Chromium-specific configurations
        channel: 'chrome',
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: [
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-extensions',
            '--disable-gpu',
            '--disable-web-security',
            '--allow-running-insecure-content',
          ],
        },
      },
    },
  ],
});