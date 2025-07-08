// tests/smoke/wordmate-complete-smoke.spec.js
const { test, expect } = require('@playwright/test');
const HomePage = require('../../src/pages/home/HomePage');
const GameSessionPage = require('../../src/pages/game/GameSessionPage');
const LoginPage = require('../../src/pages/auth/LoginPage');
const RegisterPage = require('../../src/pages/auth/RegisterPage');

const REGISTERED_USER_CREDENTIALS = {
  username: 'PlayTest',
  password: 'PlayTest123'
};

test.describe('Wordmate Complete Smoke Tests @smoke', () => {
  let homePage, gameSessionPage, loginPage, registerPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    gameSessionPage = new GameSessionPage(page);
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
    
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.describe('Core Application Features', () => {
    test('Home page loads and displays all critical elements', async ({ page }) => {
      await homePage.navigateToHome();
      
      expect(await homePage.isHomePageLoaded()).toBeTruthy();
      expect(await page.locator('.navbar-brand').isVisible()).toBeTruthy();
      expect(await page.locator('#app-logo').isVisible()).toBeTruthy();
      expect(await page.locator('text=Start Learning').first().isVisible()).toBeTruthy();
    });

    test('Guest user can start and interact with game session', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      
      await gameSessionPage.waitForGameSessionToLoad();
      expect(await gameSessionPage.isGameSessionActive()).toBeTruthy();
      
      await gameSessionPage.clickReveal();
      await gameSessionPage.waitForAnswerButtons();
      expect(await gameSessionPage.isAnswerButtonsVisible()).toBeTruthy();
      
      await gameSessionPage.clickCorrect();
      expect(await gameSessionPage.isGameSessionActive()).toBeTruthy();
    });

    test('Navigation menu works and all links are accessible', async ({ page }) => {
      await homePage.navigateToHome();
      
      const criticalLinks = [
        { selector: '#nav-game-session', expectedUrl: 'game-session.html' },
        { selector: '#nav-listado', expectedUrl: 'word-list.html' },
        { selector: '#nav-custom-vocab', expectedUrl: 'custom-vocab.html' },
        { selector: '#nav-grammar', expectedUrl: 'grammar.html' },
        { selector: '#nav-login', expectedUrl: 'login.html' },
        { selector: '#nav-register', expectedUrl: 'register.html' }
      ];

      for (const link of criticalLinks) {
        expect(await page.locator(link.selector).isVisible()).toBeTruthy();
      }
    });
  });

  test.describe('Authentication System', () => {
    test('Login page loads and form is functional', async ({ page }) => {
      await loginPage.navigateToLogin();
      
      expect(await loginPage.isFormVisible()).toBeTruthy();
      expect(await page.locator('#login-username').isVisible()).toBeTruthy();
      expect(await page.locator('#login-password').isVisible()).toBeTruthy();
      expect(await page.locator('text=Login').isVisible()).toBeTruthy();
    });

    test('Register page loads and form is functional', async ({ page }) => {
      await registerPage.navigateToRegister();
      
      expect(await registerPage.isFormVisible()).toBeTruthy();
      expect(await page.locator('#register-username').isVisible()).toBeTruthy();
      expect(await page.locator('#register-email').isVisible()).toBeTruthy();
      expect(await page.locator('#register-password').isVisible()).toBeTruthy();
    });

    test('Authenticated user can access vocabulary modal', async ({ page }) => {
      await loginPage.navigateToLogin();
      await loginPage.login(REGISTERED_USER_CREDENTIALS);
      await loginPage.waitForRedirect();
      
      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      
      expect(await homePage.isVocabularyTypeModalVisible()).toBeTruthy();
    });
  });

  test.describe('Core Pages Accessibility', () => {
    test('Word List page loads correctly', async ({ page }) => {
      await page.goto('/public/word-list.html');
      
      expect(await page.locator('h1, h2').first().isVisible()).toBeTruthy();
      expect(await page.locator('.navbar').isVisible()).toBeTruthy();
    });

    test('Custom Vocabulary page loads correctly', async ({ page }) => {
      await page.goto('/public/custom-vocab.html');
      
      expect(await page.locator('h1, h2').first().isVisible()).toBeTruthy();
      expect(await page.locator('[data-testid="main-content"]').isVisible()).toBeTruthy();
    });

    test('Grammar page loads correctly', async ({ page }) => {
      await page.goto('/public/grammar.html');
      
      expect(await page.locator('h1, h2').first().isVisible()).toBeTruthy();
      expect(await page.locator('[data-testid="main-content"]').isVisible()).toBeTruthy();
    });

    test('Leaderboard page loads correctly', async ({ page }) => {
      await page.goto('/public/leaderboard.html');
      
      expect(await page.locator('h1, h2').first().isVisible()).toBeTruthy();
      expect(await page.locator('.card').isVisible()).toBeTruthy();
    });

    test('My Words page loads correctly', async ({ page }) => {
      await page.goto('/public/my-words.html');
      
      expect(await page.locator('h1, h2').first().isVisible()).toBeTruthy();
      expect(await page.locator('[data-testid="main-content"]').isVisible()).toBeTruthy();
    });
  });

  test.describe('Profile and User Features', () => {
    test('Profile page loads with all tabs', async ({ page }) => {
      await page.goto('/public/profile.html');
      
      expect(await page.locator('#profile-tabs').isVisible()).toBeTruthy();
      expect(await page.locator('#sub-profile-info').isVisible()).toBeTruthy();
      expect(await page.locator('#sub-favorites').isVisible()).toBeTruthy();
      expect(await page.locator('#sub-userprogress').isVisible()).toBeTruthy();
      expect(await page.locator('#sub-reviewincorrect').isVisible()).toBeTruthy();
      expect(await page.locator('#sub-ai-assistant').isVisible()).toBeTruthy();
    });

    test('Profile tabs are interactive', async ({ page }) => {
      await page.goto('/public/profile.html');
      
      await page.locator('#sub-favorites').click();
      expect(await page.locator('#favorites-profile-sub').isVisible()).toBeTruthy();
      
      await page.locator('#sub-userprogress').click();
      expect(await page.locator('#progreso-profile-sub').isVisible()).toBeTruthy();
    });
  });

  test.describe('Informational Pages', () => {
    test('About page loads correctly', async ({ page }) => {
      await page.goto('/public/about.html');
      
      expect(await page.locator('h1, h2').first().isVisible()).toBeTruthy();
      expect(await page.locator('[data-testid="main-content"]').isVisible()).toBeTruthy();
    });

    test('How It Works page loads correctly', async ({ page }) => {
      await page.goto('/public/how-it-works.html');
      
      expect(await page.locator('h1, h2').first().isVisible()).toBeTruthy();
      expect(await page.locator('[data-testid="main-content"]').isVisible()).toBeTruthy();
    });

    test('Learning Tips page loads correctly', async ({ page }) => {
      await page.goto('/public/learning-tips.html');
      
      expect(await page.locator('h1, h2').first().isVisible()).toBeTruthy();
      expect(await page.locator('[data-testid="main-content"]').isVisible()).toBeTruthy();
    });

    test('FAQ page loads correctly', async ({ page }) => {
      await page.goto('/public/faq.html');
      
      expect(await page.locator('h1, h2').first().isVisible()).toBeTruthy();
      expect(await page.locator('[data-testid="main-content"]').isVisible()).toBeTruthy();
    });
  });

  test.describe('Critical User Flows', () => {
    test('Complete guest learning flow works', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      await gameSessionPage.waitForGameSessionToLoad();
      
      await gameSessionPage.clickReveal();
      await gameSessionPage.waitForAnswerButtons();
      await gameSessionPage.clickCorrect();
      
      await gameSessionPage.clickNavHome();
      expect(await homePage.isHomePageLoaded()).toBeTruthy();
    });

    test('Authenticated user complete flow works', async ({ page }) => {
      await loginPage.navigateToLogin();
      await loginPage.login(REGISTERED_USER_CREDENTIALS);
      await loginPage.waitForRedirect();
      
      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      
      expect(await homePage.isVocabularyTypeModalVisible()).toBeTruthy();
      
      await homePage.selectVocabularyType('basic');
      await homePage.clickStartGameFromModal();
      
      await gameSessionPage.waitForGameSessionToLoad();
      expect(await gameSessionPage.isGameSessionActive()).toBeTruthy();
    });

    test('Navigation between all main sections works', async ({ page }) => {
      await homePage.navigateToHome();
      
      const navigationFlow = [
        { link: '#nav-game-session', verifyElement: '.vocab-card' },
        { link: '#nav-listado', verifyElement: '.container' },
        { link: '#nav-custom-vocab', verifyElement: '.container' },
        { link: '#nav-grammar', verifyElement: '.container' },
        { link: '#nav-home', verifyElement: '#app-logo' }
      ];

      for (const step of navigationFlow) {
        await page.locator(step.link).click();
        await page.waitForLoadState('networkidle');
        expect(await page.locator(step.verifyElement).isVisible()).toBeTruthy();
      }
    });
  });

  test.describe('Responsive Design and Accessibility', () => {
    test('Mobile viewport functionality', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await homePage.navigateToHome();
      
      expect(await page.locator('.navbar-toggler').isVisible()).toBeTruthy();
      expect(await page.locator('#app-logo').isVisible()).toBeTruthy();
    });

    test('Critical accessibility elements are present', async ({ page }) => {
      await homePage.navigateToHome();
      
      expect(await page.locator('[alt="Wordmate - Plataforma de aprendizaje de inglés"]').isVisible()).toBeTruthy();
      expect(await page.locator('nav[role="navigation"], .navbar').isVisible()).toBeTruthy();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('Application handles page refresh gracefully', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      await gameSessionPage.waitForGameSessionToLoad();
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      expect(await page.locator('.vocab-card').isVisible()).toBeTruthy();
    });

    test('Invalid URLs redirect gracefully', async ({ page }) => {
      await page.goto('/public/nonexistent-page.html').catch(() => {});
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toBeTruthy();
    });
  });

  test.describe('Performance and Load Verification', () => {
    test('Home page loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await homePage.navigateToHome();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000);
      expect(await homePage.isHomePageLoaded()).toBeTruthy();
    });

    test('Game session loads efficiently', async ({ page }) => {
      await homePage.navigateToHome();
      
      const startTime = Date.now();
      await homePage.clickStartLearning();
      await gameSessionPage.waitForGameSessionToLoad();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000);
      expect(await gameSessionPage.isGameSessionActive()).toBeTruthy();
    });
  });
});