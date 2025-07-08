const { defineConfig, devices } = require('@playwright/test');
const baseConfig = require('./environments/base.config.js');

module.exports = defineConfig({
  ...baseConfig,
  testDir: '../tests/smoke',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['html', { outputFolder: 'reports/smoke-html-report' }],
    ['json', { outputFile: 'reports/smoke-results.json' }],
    ['junit', { outputFile: 'reports/smoke-results.xml' }],
    ['line']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://wordmate.es',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    actionTimeout: 10000,
    navigationTimeout: 30000
  },
  timeout: 60000,
  expect: {
    timeout: 15000
  },
  projects: [
    {
      name: 'chromium-smoke',
      use: { ...devices['Desktop Chrome'] },
      grep: /@smoke/
    },
    {
      name: 'firefox-smoke',
      use: { ...devices['Desktop Firefox'] },
      grep: /@smoke/
    },
    {
      name: 'webkit-smoke',
      use: { ...devices['Desktop Safari'] },
      grep: /@smoke/
    },
    {
      name: 'mobile-smoke',
      use: { ...devices['iPhone 12'] },
      grep: /@smoke/
    }
  ],
  outputDir: 'test-results/smoke'
});