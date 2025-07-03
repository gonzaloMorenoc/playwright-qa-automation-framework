import { test as base, expect } from '@playwright/test';

const test = base.extend({
  baseURL: async ({}, use) => {
    const baseURL = process.env.BASE_URL || 'https://wordmate.es/dev';
    await use(baseURL);
  },
  
  testData: async ({}, use) => {
    const testData = await import('../test-data/users/valid-users.json', { assert: { type: 'json' } });
    await use(testData.default);
  },
});

export { test, expect };