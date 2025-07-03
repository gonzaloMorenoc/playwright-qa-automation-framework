// configs/performance.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '../tests/performance',
  timeout: 120000,
  expect: {
    timeout: 30000,
  },
  use: {
    baseURL: process.env.BASE_URL || 'https://demo-app.com',
    // Performance-specific settings
    video: 'off',
    screenshot: 'off',
    trace: 'off',
  },
  reporter: [
    ['json', { outputFile: 'reports/performance/performance-results.json' }],
    ['html', { outputFolder: 'reports/performance/html', open: 'never' }],
  ],
  projects: [
    {
      name: 'performance-chromium',
      use: {
        browserName: 'chromium',
        launchOptions: {
          args: ['--disable-dev-shm-usage', '--no-sandbox'],
        },
      },
    },
  ],
});