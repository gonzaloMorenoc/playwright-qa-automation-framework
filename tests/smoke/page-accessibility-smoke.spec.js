const { test, expect } = require('@playwright/test');

test.describe('Page Accessibility Smoke Tests @smoke @accessibility', () => {
  const pages = [
    { name: 'Home', url: '/' },
    { name: 'Game Session', url: '/public/game-session.html' },
    { name: 'Word List', url: '/public/word-list.html' },
    { name: 'Custom Vocab', url: '/public/custom-vocab.html' },
    { name: 'My Words', url: '/public/my-words.html' },
    { name: 'Profile', url: '/public/profile.html' },
    { name: 'Grammar', url: '/public/grammar.html' },
    { name: 'Leaderboard', url: '/public/leaderboard.html' },
    { name: 'Login', url: '/public/login.html' },
    { name: 'Register', url: '/public/register.html' },
    { name: 'About', url: '/public/about.html' },
    { name: 'How It Works', url: '/public/how-it-works.html' },
    { name: 'Learning Tips', url: '/public/learning-tips.html' },
    { name: 'FAQ', url: '/public/faq.html' }
  ];

  for (const pageInfo of pages) {
    test(`${pageInfo.name} page loads and has basic accessibility`, async ({ page }) => {
      await test.step(`Navigate to ${pageInfo.name}`, async () => {
        await page.goto(pageInfo.url);
        await page.waitForLoadState('networkidle');
      });

      await test.step('Check basic page structure', async () => {
        expect(await page.locator('nav, .navbar').isVisible()).toBeTruthy();
        expect(await page.locator('h1, h2, h3').first().isVisible()).toBeTruthy();
      });

      await test.step('Check navigation accessibility', async () => {
        const navExists = await page.locator('nav').count() > 0;
        expect(navExists).toBeTruthy();
      });

      await test.step('Check page title exists', async () => {
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
      });
    });
  }
});