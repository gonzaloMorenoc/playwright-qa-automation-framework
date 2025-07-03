const { defineConfig } = require('@playwright/test');
const baseConfig = require('./base.config.js');

module.exports = defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: 'https://wordmate.es',
    // Additional test-specific settings
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  // Specific settings for test environment
  timeout: 60000, // Longer timeout for potentially slower responses
  workers: 1, // Single worker to avoid conflicts during registration tests
  retries: 1, // Allow one retry for flaky tests
});