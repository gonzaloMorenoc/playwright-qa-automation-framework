const { test, expect } = require('@playwright/test');
const HomePage = require('../../src/pages/home/HomePage');

test.describe('Cross-Browser Smoke Tests @smoke @cross-browser', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('Core functionality works across browsers', async ({ page, browserName }) => {
    await test.step(`Test on ${browserName}`, async () => {
      await homePage.navigateToHome();
      expect(await homePage.isHomePageLoaded()).toBeTruthy();
      
      const logo = await page.locator('#app-logo');
      expect(await logo.isVisible()).toBeTruthy();
      
      const startButton = await page.locator('text=Start Learning').first();
      expect(await startButton.isVisible()).toBeTruthy();
    });
  });

  test('Navigation menu works across browsers', async ({ page, browserName }) => {
    await test.step(`Navigation test on ${browserName}`, async () => {
      await homePage.navigateToHome();
      
      const navItems = [
        '#nav-game-session',
        '#nav-listado', 
        '#nav-custom-vocab',
        '#nav-grammar',
        '#nav-login'
      ];

      for (const navItem of navItems) {
        expect(await page.locator(navItem).isVisible()).toBeTruthy();
      }
    });
  });
});