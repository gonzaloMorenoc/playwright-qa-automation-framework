const { test, expect } = require('@playwright/test');
const HomePage = require('../../../src/pages/home/HomePage');
const GameSessionPage = require('../../../src/pages/game/GameSessionPage');
const LoginPage = require('../../../src/pages/auth/LoginPage');
const ProfilePage = require('../../../src/pages/profile/ProfilePage');
const WordListPage = require('../../../src/pages/vocabulary/WordListPage');
const CustomVocabPage = require('../../../src/pages/vocabulary/CustomVocabPage');
const MyWordsPage = require('../../../src/pages/vocabulary/MyWordsPage');
const GrammarPage = require('../../../src/pages/grammar/GrammarPage');
const LeaderboardPage = require('../../../src/pages/leaderboard/LeaderboardPage');
const StaticPage = require('../../../src/pages/static/StaticPage');

const SMOKE_USER = {
  username: 'SmokeTest',
  password: 'SmokeTest123'
};

test.describe('Critical Paths Smoke Tests @smoke @critical', () => {
  let homePage, gameSessionPage, loginPage, profilePage;
  let wordListPage, customVocabPage, myWordsPage, grammarPage;
  let leaderboardPage, staticPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    gameSessionPage = new GameSessionPage(page);
    loginPage = new LoginPage(page);
    profilePage = new ProfilePage(page);
    wordListPage = new WordListPage(page);
    customVocabPage = new CustomVocabPage(page);
    myWordsPage = new MyWordsPage(page);
    grammarPage = new GrammarPage(page);
    leaderboardPage = new LeaderboardPage(page);
    staticPage = new StaticPage(page);

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('Critical Path 1: Guest User Learning Journey', async ({ page }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.navigateToHome();
      expect(await homePage.isHomePageLoaded()).toBeTruthy();
    });

    await test.step('Start learning session', async () => {
      await homePage.clickStartLearning();
      await gameSessionPage.waitForGameSessionToLoad();
      expect(await gameSessionPage.isGameSessionActive()).toBeTruthy();
    });

    await test.step('Complete basic interaction', async () => {
      await gameSessionPage.clickReveal();
      await gameSessionPage.waitForAnswerButtons();
      expect(await gameSessionPage.isAnswerButtonsVisible()).toBeTruthy();
      await gameSessionPage.clickCorrect();
    });

    await test.step('Return to home', async () => {
      await gameSessionPage.clickNavHome();
      expect(await homePage.isHomePageLoaded()).toBeTruthy();
    });
  });

  test('Critical Path 2: Authenticated User Complete Flow', async ({ page }) => {
    await test.step('Login user', async () => {
      await loginPage.navigateToLogin();
      await loginPage.login(SMOKE_USER);
      await loginPage.waitForRedirect();
    });

    await test.step('Access vocabulary selection', async () => {
      await homePage.navigateToHome();
      await homePage.clickStartLearning();
      expect(await homePage.isVocabularyTypeModalVisible()).toBeTruthy();
    });

    await test.step('Start advanced session', async () => {
      await homePage.selectVocabularyType('basic');
      await homePage.clickStartGameFromModal();
      await gameSessionPage.waitForGameSessionToLoad();
      expect(await gameSessionPage.isGameSessionActive()).toBeTruthy();
    });

    await test.step('Use authenticated features', async () => {
      expect(await gameSessionPage.isFavoriteButtonVisible()).toBeTruthy();
      await gameSessionPage.clickFavoriteButton();
    });
  });

  test('Critical Path 3: Profile and User Data Access', async ({ page }) => {
    await test.step('Access profile page', async () => {
      await profilePage.navigateToProfile();
      expect(await profilePage.isProfilePageLoaded()).toBeTruthy();
    });

    await test.step('Navigate through profile tabs', async () => {
      await profilePage.clickFavoritesTab();
      expect(await profilePage.isFavoritesContentVisible()).toBeTruthy();
      
      await profilePage.clickProgressTab();
      expect(await profilePage.isProgressContentVisible()).toBeTruthy();
    });
  });

  test('Critical Path 4: Vocabulary Management Flow', async ({ page }) => {
    await test.step('Access word list', async () => {
      await wordListPage.navigateToWordList();
      expect(await wordListPage.isWordListPageLoaded()).toBeTruthy();
    });

    await test.step('Access custom vocabulary', async () => {
      await customVocabPage.navigateToCustomVocab();
      expect(await customVocabPage.isCustomVocabPageLoaded()).toBeTruthy();
      expect(await customVocabPage.isFormatInstructionsVisible()).toBeTruthy();
    });

    await test.step('Access my words (if authenticated)', async () => {
      await myWordsPage.navigateToMyWords();
      expect(await myWordsPage.isMyWordsPageLoaded()).toBeTruthy();
    });
  });

  test('Critical Path 5: Learning Resources Access', async ({ page }) => {
    await test.step('Access grammar lessons', async () => {
      await grammarPage.navigateToGrammar();
      expect(await grammarPage.isGrammarPageLoaded()).toBeTruthy();
    });

    await test.step('Access leaderboard', async () => {
      await leaderboardPage.navigateToLeaderboard();
      expect(await leaderboardPage.isLeaderboardPageLoaded()).toBeTruthy();
    });

    await test.step('Access static pages', async () => {
      await staticPage.navigateToAbout();
      expect(await staticPage.isPageLoaded()).toBeTruthy();
      
      await staticPage.navigateToHowItWorks();
      expect(await staticPage.isPageLoaded()).toBeTruthy();
    });
  });
});