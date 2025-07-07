const { test, expect } = require('@playwright/test');
const HomePage = require('../../../src/pages/home/HomePage');
const GameSessionPage = require('../../../src/pages/game/GameSessionPage');
const LoginPage = require('../../../src/pages/auth/LoginPage');

const REGISTERED_USER_CREDENTIALS = {
  username: 'PlayTest',
  password: 'PlayTest123'
};

test.describe('Game Session Smoke Tests @smoke', () => {
  let homePage;
  let gameSessionPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    gameSessionPage = new GameSessionPage(page);
    loginPage = new LoginPage(page);
  });

  test('Guest user can access and start a basic game session', async () => {
    await homePage.navigateToHome();
    
    expect(await homePage.isHomePageLoaded()).toBeTruthy();
    
    await homePage.clickStartLearning();
    
    await gameSessionPage.waitForGameSessionToLoad();
    
    expect(await gameSessionPage.isGameSessionActive()).toBeTruthy();
  });

  test('Authenticated user can access vocabulary selection modal', async () => {
    await loginPage.navigateToLogin();
    
    // Clear storage after navigation for clean state
    await loginPage.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await loginPage.login(REGISTERED_USER_CREDENTIALS);
    await loginPage.waitForRedirect();
    
    await homePage.navigateToHome();
    await homePage.clickStartLearning();
    
    expect(await homePage.isVocabularyTypeModalVisible()).toBeTruthy();
  });

  test('Game session basic interaction flow works', async () => {
    await homePage.navigateToHome();
    await homePage.clickStartLearning();
    await gameSessionPage.waitForGameSessionToLoad();
    
    await gameSessionPage.clickReveal();
    await gameSessionPage.waitForAnswerButtons();
    
    expect(await gameSessionPage.isAnswerButtonsVisible()).toBeTruthy();
    
    await gameSessionPage.clickCorrect();
    
    expect(await gameSessionPage.isGameSessionActive()).toBeTruthy();
  });

  test('Navigation between home and game session works', async () => {
    await homePage.navigateToHome();
    await homePage.clickStartLearning();
    await gameSessionPage.waitForGameSessionToLoad();
    
    await gameSessionPage.clickNavHome();
    
    expect(await homePage.isHomePageLoaded()).toBeTruthy();
  });

  test('Authenticated user features are accessible', async () => {
    await loginPage.navigateToLogin();
    
    // Clear storage after navigation for clean state
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
    
    // Both favorite button and My Words should be visible for authenticated users
    expect(await gameSessionPage.isFavoriteButtonAlwaysVisible()).toBeTruthy();
    expect(await gameSessionPage.isAddToMyWordsVisible()).toBeTruthy();
  });
});