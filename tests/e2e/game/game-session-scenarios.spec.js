const { test, expect } = require('@playwright/test');
const HomePage = require('../../../src/pages/home/HomePage');
const GameSessionPage = require('../../../src/pages/game/GameSessionPage');
const LoginPage = require('../../../src/pages/auth/LoginPage');

const REGISTERED_USER_CREDENTIALS = {
  username: 'PlayTest',
  password: 'PlayTest123'
};

test.describe('Game Session Advanced Scenarios', () => {
  let homePage;
  let gameSessionPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    gameSessionPage = new GameSessionPage(page);
    loginPage = new LoginPage(page);
  });

  test.describe.skip('Performance and Load Tests', () => {
    test('should handle rapid successive interactions without breaking', async () => {
      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      await gameSessionPage.waitForGameSessionToLoad();

      for (let i = 0; i < 5; i++) {
        await gameSessionPage.clickReveal();
        await gameSessionPage.waitForAnswerButtons();
        await gameSessionPage.clickCorrect();
        
        if (await gameSessionPage.isNextWordAvailable()) {
          continue;
        } else {
          break;
        }
      }

      expect(await gameSessionPage.isGameSessionActive()).toBeTruthy();
    });

    test('should maintain session stability during long gameplay', async () => {
      await loginPage.navigateToLogin();
      await loginPage.login(REGISTERED_USER_CREDENTIALS);
      await loginPage.waitForRedirect();

      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      await homePage.selectVocabularyType('basic');
      await homePage.clickStartGameFromModal();
      await gameSessionPage.waitForGameSessionToLoad();

      for (let i = 0; i < 10; i++) {
        await gameSessionPage.clickReveal();
        await gameSessionPage.waitForAnswerButtons();
        
        if (i % 2 === 0) {
          await gameSessionPage.clickCorrect();
        } else {
          await gameSessionPage.clickIncorrect();
        }
        
        if (await gameSessionPage.isNextWordAvailable()) {
          continue;
        } else {
          break;
        }
      }

      expect(await gameSessionPage.isUserStillAuthenticated()).toBeTruthy();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate first, then clear storage
      await homePage.navigateToHome();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });
    
    test('should handle network interruption gracefully', async () => {
      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      await gameSessionPage.waitForGameSessionToLoad();

      await gameSessionPage.page.context().setOffline(true);
      
      await gameSessionPage.clickReveal();
      
      await gameSessionPage.page.context().setOffline(false);
      
      expect(await gameSessionPage.isGameSessionActive()).toBeTruthy();
    });

    test('should recover from session timeout for authenticated users', async () => {
      await loginPage.navigateToLogin();
      await loginPage.login(REGISTERED_USER_CREDENTIALS);
      await loginPage.waitForRedirect();

      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      await homePage.selectVocabularyType('basic');
      await homePage.clickStartGameFromModal();
      await gameSessionPage.waitForGameSessionToLoad();

      // Remove auth token after page is loaded
      await gameSessionPage.page.evaluate(() => {
        localStorage.removeItem('authToken');
      });

      await gameSessionPage.clickReveal();
      
      const isModalVisible = await gameSessionPage.page.locator('#auth-required-modal').isVisible().catch(() => false);
      const isRedirected = gameSessionPage.page.url().includes('login.html');
      
      expect(isModalVisible || isRedirected).toBeTruthy();
    });

    test('should handle empty vocabulary gracefully', async () => {
      await homePage.navigateToHome();
      
      await gameSessionPage.page.evaluate(() => {
        sessionStorage.setItem('empty_vocab_test', 'true');
      });

      await homePage.clickStartLearning();

      const isErrorDisplayed = await gameSessionPage.page.locator('.error-message').isVisible().catch(() => false);
      const isBackToHome = await homePage.isHomePageLoaded();

      expect(isErrorDisplayed || isBackToHome).toBeTruthy();
    });
  });

  test.describe('Keyboard and Accessibility Tests', () => {
    test('should support keyboard navigation in game session', async () => {
      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      await gameSessionPage.waitForGameSessionToLoad();

      await gameSessionPage.page.keyboard.press('Space');
      await gameSessionPage.waitForAnswerButtons();

      await gameSessionPage.page.keyboard.press('ArrowRight');
      
      expect(await gameSessionPage.isAnswerButtonsVisible()).toBeTruthy();
    });

    test('should have proper ARIA labels for screen readers', async () => {
      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      await gameSessionPage.waitForGameSessionToLoad();

      const revealButton = await gameSessionPage.page.locator(gameSessionPage.revealBtn);
      const ariaLabel = await revealButton.getAttribute('aria-label');
      
      expect(ariaLabel).toBeTruthy();
    });
  });

  test.describe('Mobile Responsive Tests', () => {
    test('should work correctly on mobile viewport', async () => {
      await gameSessionPage.page.setViewportSize({ width: 375, height: 667 });

      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      await gameSessionPage.waitForGameSessionToLoad();

      await gameSessionPage.clickReveal();
      await gameSessionPage.waitForAnswerButtons();

      expect(await gameSessionPage.isAnswerButtonsVisible()).toBeTruthy();
    });

    test('should handle touch interactions properly', async () => {
      await gameSessionPage.page.setViewportSize({ width: 375, height: 667 });

      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      await gameSessionPage.waitForGameSessionToLoad();

      const revealButton = await gameSessionPage.page.locator(gameSessionPage.revealBtn);
      await revealButton.tap();
      
      await gameSessionPage.waitForAnswerButtons();

      const correctButton = await gameSessionPage.page.locator(gameSessionPage.correctBtn);
      await correctButton.tap();

      expect(await gameSessionPage.isNextWordAvailable()).toBeTruthy();
    });
  });

  test.describe('Data Persistence Tests', () => {
    test('should preserve game state across page refreshes for authenticated users', async () => {
      await loginPage.navigateToLogin();
      
      // Clear storage after navigation
      await loginPage.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      await loginPage.login(REGISTERED_USER_CREDENTIALS);
      await loginPage.waitForRedirect();

      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      await homePage.selectVocabularyType('basic');
      await homePage.clickStartGameFromModal();
      await gameSessionPage.waitForGameSessionToLoad();

      await gameSessionPage.clickReveal();
      await gameSessionPage.clickCorrect();

      const progressBefore = await gameSessionPage.getProgressCount();

      await gameSessionPage.page.reload();
      await gameSessionPage.waitForGameSessionToLoad();

      const progressAfter = await gameSessionPage.getProgressCount();
      expect(progressAfter).toEqual(progressBefore);
    });

    test('should clear guest session data when switching to authenticated user', async () => {
      await homePage.navigateToHome();
      
      // Clear storage after navigation
      await homePage.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      await homePage.clickStartLearning();
      await gameSessionPage.waitForGameSessionToLoad();

      await gameSessionPage.clickReveal();
      await gameSessionPage.clickCorrect();

      await gameSessionPage.clickNavHome();

      await loginPage.navigateToLogin();
      await loginPage.login(REGISTERED_USER_CREDENTIALS);
      await loginPage.waitForRedirect();

      await homePage.clickStartLearning();
      await homePage.selectVocabularyType('basic');
      await homePage.clickStartGameFromModal();
      await gameSessionPage.waitForGameSessionToLoad();

      const progress = await gameSessionPage.getProgressCount();
      expect(progress).toEqual('0');
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    test('should maintain functionality across different browsers', async () => {
      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      await gameSessionPage.waitForGameSessionToLoad();

      await gameSessionPage.clickReveal();
      await gameSessionPage.waitForAnswerButtons();
      await gameSessionPage.clickCorrect();

      expect(await gameSessionPage.isNextWordAvailable()).toBeTruthy();
      
      // Favorite button should always be visible regardless of browser
      expect(await gameSessionPage.isFavoriteButtonAlwaysVisible()).toBeTruthy();
    });
  });
});