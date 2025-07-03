const { test, expect } = require('@playwright/test');
const HomePage = require('../../../src/pages/home/HomePage');
const GameSessionPage = require('../../../src/pages/game/GameSessionPage');

test.describe('Home Navigation Flow', () => {
  let homePage;
  let gameSessionPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    gameSessionPage = new GameSessionPage(page);
  });

  test('should navigate from home to game session and back', async () => {
    await homePage.navigateToHome();
    
    await expect(await homePage.isHomePageLoaded()).toBeTruthy();
    
    await homePage.clickStartLearning();
    
    await gameSessionPage.waitForGameSessionToLoad();
    
    await gameSessionPage.clickReveal();
    
    await gameSessionPage.waitForAnswerButtons();
    
    await expect(await gameSessionPage.isAnswerButtonsVisible()).toBeTruthy();
    
    await gameSessionPage.clickCorrect();
    
    await gameSessionPage.clickNavHome();
    
    await expect(await homePage.isHomePageLoaded()).toBeTruthy();
  });
});