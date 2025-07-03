const { test as base, expect } = require('@playwright/test');

const test = base.extend({
  baseURL: async ({}, use) => {
    const baseURL = process.env.BASE_URL || 'https://wordmate.es/dev';
    await use(baseURL);
  },
  
  testData: async ({}, use) => {
    const testData = require('../test-data/users/valid-users.json');
    await use(testData);
  },
});

module.exports = { test, expect };