const { test, expect } = require('@playwright/test');
const HomePage = require('../../../src/pages/home/HomePage');
const GameSessionPage = require('../../../src/pages/game/GameSessionPage');
const LoginPage = require('../../../src/pages/auth/LoginPage');

const REGISTERED_USER_CREDENTIALS = {
  username: 'PlayTest',
  password: 'PlayTest123'
};

test.describe('Game Session E2E Tests', () => {
  let homePage;
  let gameSessionPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    gameSessionPage = new GameSessionPage(page);
    loginPage = new LoginPage(page);
  });

  test.describe('Guest User Game Sessions', () => {
    test.beforeEach(async ({ page }) => {
      await page.context().clearCookies();
      
      // Navigate to home page first, then clear storage
      await homePage.navigateToHome();
      
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });

    test('should allow guest user to start and complete a game session', async () => {
      await homePage.navigateToHome();
      
      await expect(await homePage.isHomePageLoaded()).toBeTruthy();
      
      await homePage.clickStartLearning();
      
      await gameSessionPage.waitForGameSessionToLoad();
      
      await gameSessionPage.clickReveal();
      
      await gameSessionPage.waitForAnswerButtons();
      
      await expect(await gameSessionPage.isAnswerButtonsVisible()).toBeTruthy();
      
      await gameSessionPage.clickCorrect();
      
      await expect(await gameSessionPage.isNextWordAvailable()).toBeTruthy();
    });

    test('should handle incorrect answers in guest session', async () => {
      await homePage.navigateToHome();
      
      await homePage.clickStartLearning();
      
      await gameSessionPage.waitForGameSessionToLoad();
      
      await gameSessionPage.clickReveal();
      
      await gameSessionPage.waitForAnswerButtons();
      
      await gameSessionPage.clickIncorrect();
      
      await expect(await gameSessionPage.isNextWordAvailable()).toBeTruthy();
    });

    test('should allow guest user to navigate back to home from game session', async () => {
      await homePage.navigateToHome();
      
      await homePage.clickStartLearning();
      
      await gameSessionPage.waitForGameSessionToLoad();
      
      await gameSessionPage.clickNavHome();
      
      await expect(await homePage.isHomePageLoaded()).toBeTruthy();
    });

    test('should show favorite button but warn guest users about registration', async () => {
      await homePage.navigateToHome();
      
      await homePage.clickStartLearning();
      
      await gameSessionPage.waitForGameSessionToLoad();
      
      // Ensure we're in guest mode
      const authToken = await gameSessionPage.page.evaluate(() => localStorage.getItem('authToken'));
      expect(authToken).toBeNull();
      
      await gameSessionPage.clickReveal();
      
      // Favorite button SHOULD be visible for guests
      expect(await gameSessionPage.isFavoriteButtonAlwaysVisible()).toBeTruthy();
      
      // But My Words should NOT be visible
      expect(await gameSessionPage.isAddToMyWordsVisible()).toBeFalsy();
    });

    test('should show registration warning when guest clicks favorite button', async () => {
      await homePage.navigateToHome();
      
      await homePage.clickStartLearning();
      
      await gameSessionPage.waitForGameSessionToLoad();
      await gameSessionPage.clickReveal();
      
      // Click favorite button as guest user
      await gameSessionPage.clickFavoriteButton();
      
      // Should show warning about registration
      const hasWarning = await gameSessionPage.hasRegistrationWarning();
      expect(hasWarning).toBeTruthy();
    });

    test('should show correct UI state for guest users', async () => {
      await homePage.navigateToHome();
      
      await homePage.clickStartLearning();
      
      await gameSessionPage.waitForGameSessionToLoad();
      await gameSessionPage.clickReveal();
      
      // Favorite button should be visible (but will warn when clicked)
      expect(await gameSessionPage.isFavoriteButtonAlwaysVisible()).toBeTruthy();
      
      // My Words should NOT be visible
      expect(await gameSessionPage.isAddToMyWordsVisible()).toBeFalsy();
    });
  });

  test.describe('Registered User Game Sessions', () => {
    test.beforeEach(async ({ page }) => {
      await page.context().clearCookies();
      
      // Navigate to login page first, then clear storage
      await loginPage.navigateToLogin();
      
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      await loginPage.login(REGISTERED_USER_CREDENTIALS);
      await loginPage.waitForRedirect();
    });

    test('should show vocabulary type modal for authenticated users', async () => {
      await homePage.navigateToHome();
      
      await expect(await homePage.isHomePageLoaded()).toBeTruthy();
      
      await homePage.clickStartLearning();
      
      await expect(await homePage.isVocabularyTypeModalVisible()).toBeTruthy();
    });

    test('should start game session with selected vocabulary type', async () => {
      await homePage.navigateToHome();
      
      await homePage.clickStartLearning();
      
      await homePage.selectVocabularyType('basic');
      
      await homePage.clickStartGameFromModal();
      
      await gameSessionPage.waitForGameSessionToLoad();
      
      await expect(await gameSessionPage.isGameSessionActive()).toBeTruthy();
    });

    test('should save progress for authenticated users', async () => {
      await homePage.navigateToHome();
      
      await homePage.clickStartLearning();
      
      await homePage.selectVocabularyType('basic');
      await homePage.clickStartGameFromModal();
      
      await gameSessionPage.waitForGameSessionToLoad();
      
      await gameSessionPage.clickReveal();
      await gameSessionPage.waitForAnswerButtons();
      await gameSessionPage.clickCorrect();
      
      const progressBefore = await gameSessionPage.getProgressCount();
      
      await gameSessionPage.navigateToHomeAndReturn();
      
      const progressAfter = await gameSessionPage.getProgressCount();
      expect(progressAfter).toEqual(progressBefore);
    });

    test('should show authenticated user features', async () => {
      await homePage.navigateToHome();
      
      await homePage.clickStartLearning();
      await homePage.selectVocabularyType('basic');
      await homePage.clickStartGameFromModal();
      
      await gameSessionPage.waitForGameSessionToLoad();
      
      await gameSessionPage.clickReveal();
      
      expect(await gameSessionPage.isFavoriteButtonVisible()).toBeTruthy();
      expect(await gameSessionPage.isAddToMyWordsVisible()).toBeTruthy();
    });

    test('should allow adding words to favorites', async () => {
      await homePage.navigateToHome();
      
      await homePage.clickStartLearning();
      await homePage.selectVocabularyType('basic');
      await homePage.clickStartGameFromModal();
      
      await gameSessionPage.waitForGameSessionToLoad();
      
      await gameSessionPage.clickReveal();
      
      await gameSessionPage.clickFavoriteButton();
      
      // Should NOT show registration warning for authenticated users
      const hasWarning = await gameSessionPage.hasRegistrationWarning();
      expect(hasWarning).toBeFalsy();
      
      expect(await gameSessionPage.isFavoriteActive()).toBeTruthy();
    });

    test('should allow adding words to My Words collection', async () => {
      await homePage.navigateToHome();
      
      await homePage.clickStartLearning();
      await homePage.selectVocabularyType('basic');
      await homePage.clickStartGameFromModal();
      
      await gameSessionPage.waitForGameSessionToLoad();
      
      await gameSessionPage.clickReveal();
      
      await gameSessionPage.clickAddToMyWords();
      
      expect(await gameSessionPage.isWordAddedToMyWords()).toBeTruthy();
    });

    test('should handle session restart for authenticated users', async () => {
      await homePage.navigateToHome();
      
      await homePage.clickStartLearning();
      await homePage.selectVocabularyType('basic');
      await homePage.clickStartGameFromModal();
      
      await gameSessionPage.waitForGameSessionToLoad();
      
      await gameSessionPage.clickReveal();
      await gameSessionPage.clickCorrect();
      
      await gameSessionPage.clickRestartSession();
      
      await gameSessionPage.waitForGameSessionToLoad();
      
      expect(await gameSessionPage.isSessionRestarted()).toBeTruthy();
    });

    test('should maintain user authentication throughout game session', async () => {
      await homePage.navigateToHome();
      
      await homePage.clickStartLearning();
      await homePage.selectVocabularyType('basic');
      await homePage.clickStartGameFromModal();
      
      await gameSessionPage.waitForGameSessionToLoad();
      
      for (let i = 0; i < 3; i++) {
        await gameSessionPage.clickReveal();
        await gameSessionPage.waitForAnswerButtons();
        await gameSessionPage.clickCorrect();
        
        if (await gameSessionPage.isNextWordAvailable()) {
          continue;
        } else {
          break;
        }
      }
      
      expect(await gameSessionPage.isUserStillAuthenticated()).toBeTruthy();
    });
  });

  test.describe('Cross-user Session Comparison', () => {
    test('should show different UX between guest and authenticated users', async ({ browser }) => {
      const guestContext = await browser.newContext();
      const authContext = await browser.newContext();
      
      const guestPage = await guestContext.newPage();
      const authPage = await authContext.newPage();
      
      const guestHomePage = new HomePage(guestPage);
      const guestGamePage = new GameSessionPage(guestPage);
      
      const authHomePage = new HomePage(authPage);
      const authGamePage = new GameSessionPage(authPage);
      const authLoginPage = new LoginPage(authPage);
      
      await authLoginPage.navigateToLogin();
      await authLoginPage.login(REGISTERED_USER_CREDENTIALS);
      await authLoginPage.waitForRedirect();
      
      await guestHomePage.navigateToHome();
      await authHomePage.navigateToHome();
      
      await guestHomePage.clickStartLearning();
      await authHomePage.clickStartLearning();
      
      await guestGamePage.waitForGameSessionToLoad();
      
      expect(await authHomePage.isVocabularyTypeModalVisible()).toBeTruthy();
      expect(await guestGamePage.isGameSessionActive()).toBeTruthy();
      
      await authHomePage.selectVocabularyType('basic');
      await authHomePage.clickStartGameFromModal();
      await authGamePage.waitForGameSessionToLoad();
      
      await guestGamePage.clickReveal();
      await authGamePage.clickReveal();
      
      // Both should show favorite button (always visible)
      expect(await guestGamePage.isFavoriteButtonAlwaysVisible()).toBeTruthy();
      expect(await authGamePage.isFavoriteButtonAlwaysVisible()).toBeTruthy();
      
      // But My Words should only be visible for authenticated users
      expect(await guestGamePage.isAddToMyWordsVisible()).toBeFalsy();
      expect(await authGamePage.isAddToMyWordsVisible()).toBeTruthy();
      
      // Test the different behavior when clicking favorites
      await guestGamePage.clickFavoriteButton();
      const guestHasWarning = await guestGamePage.hasRegistrationWarning();
      expect(guestHasWarning).toBeTruthy();
      
      await guestContext.close();
      await authContext.close();
    });
  });

  test.describe('Debug Tests (Temporary)', () => {
    test('Debug guest user UI elements visibility', async () => {
      await homePage.navigateToHome();
      
      await homePage.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      await homePage.clickStartLearning();
      await gameSessionPage.waitForGameSessionToLoad();
      
      // Debug: Check authentication state
      const authToken = await gameSessionPage.page.evaluate(() => localStorage.getItem('authToken'));
      const currentUser = await gameSessionPage.page.evaluate(() => localStorage.getItem('userInfo'));
      
      console.log('Auth Token:', authToken);
      console.log('Current User:', currentUser);
      
      // Debug: Check if elements exist and their styles
      const favoriteExists = await gameSessionPage.page.locator('#favorito-btn').count();
      const myWordsContainerExists = await gameSessionPage.page.locator('#add-to-mywords-container').count();
      const myWordsButtonExists = await gameSessionPage.page.locator('#add-to-mywords-btn').count();
      
      console.log('Favorite button count:', favoriteExists);
      console.log('My Words container count:', myWordsContainerExists);
      console.log('My Words button count:', myWordsButtonExists);
      
      // Check container styles specifically
      if (myWordsContainerExists > 0) {
        const containerStyle = await gameSessionPage.page.locator('#add-to-mywords-container').evaluate(el => {
          const style = window.getComputedStyle(el);
          return {
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            inlineStyle: el.style.display
          };
        });
        console.log('My Words container style:', containerStyle);
      }
      
      // Check favorite button (should always be visible)
      if (favoriteExists > 0) {
        const favoriteInfo = await gameSessionPage.page.locator('#favorito-btn').evaluate(el => {
          const style = window.getComputedStyle(el);
          return {
            display: style.display,
            visibility: style.visibility,
            disabled: el.disabled,
            clickable: !el.disabled && style.pointerEvents !== 'none'
          };
        });
        console.log('Favorite button info (should be visible):', favoriteInfo);
      }
      
      // Test clicking favorite as guest (should show warning)
      await gameSessionPage.clickReveal();
      await gameSessionPage.clickFavoriteButton();
      
      await gameSessionPage.page.waitForTimeout(2000);
      
      const hasWarning = await gameSessionPage.hasRegistrationWarning();
      console.log('Shows registration warning after favorite click:', hasWarning);
      
      // Take screenshot for visual inspection
      await gameSessionPage.page.screenshot({ path: 'debug-guest-ui.png', fullPage: true });
      
      // Test the actual methods
      const favoriteVisible = await gameSessionPage.isFavoriteButtonAlwaysVisible();
      const myWordsVisible = await gameSessionPage.isAddToMyWordsVisible();
      
      console.log('Test methods results:');
      console.log('- isFavoriteButtonAlwaysVisible():', favoriteVisible, '(should be true)');
      console.log('- isAddToMyWordsVisible():', myWordsVisible, '(should be false)');
      
      // This test is just for debugging, so always pass
      expect(true).toBeTruthy();
    });
  });
});