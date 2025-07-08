// src/pages/profile/ProfilePage.js
const BasePage = require('../base/BasePage');

class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
    
    this.profileTabs = '#profile-tabs';
    this.profileInfoTab = '#sub-profile-info';
    this.favoritesTab = '#sub-favorites';
    this.progressTab = '#sub-userprogress';
    this.reviewIncorrectTab = '#sub-reviewincorrect';
    this.aiAssistantTab = '#sub-ai-assistant';
    
    this.profileInfoContent = '#profile-info-sub';
    this.favoritesContent = '#favorites-profile-sub';
    this.progressContent = '#progreso-profile-sub';
    this.reviewIncorrectContent = '#review-incorrect-profile-sub';
    this.aiAssistantContent = '#ai-assistant-profile-sub';
    
    this.profileNameInput = '#profile-name-text';
    this.profileUsernameInput = '#profile-username-text';
  }

  async navigateToProfile() {
    await this.navigate('/public/profile.html');
  }

  async isProfilePageLoaded() {
    return await this.isElementVisible(this.profileTabs);
  }

  async clickFavoritesTab() {
    await this.clickElement(this.favoritesTab);
  }

  async clickProgressTab() {
    await this.clickElement(this.progressTab);
  }

  async clickReviewIncorrectTab() {
    await this.clickElement(this.reviewIncorrectTab);
  }

  async clickAiAssistantTab() {
    await this.clickElement(this.aiAssistantTab);
  }

  async isFavoritesContentVisible() {
    return await this.isElementVisible(this.favoritesContent);
  }

  async isProgressContentVisible() {
    return await this.isElementVisible(this.progressContent);
  }

  async isReviewIncorrectContentVisible() {
    return await this.isElementVisible(this.reviewIncorrectContent);
  }

  async isAiAssistantContentVisible() {
    return await this.isElementVisible(this.aiAssistantContent);
  }

  async getProfileName() {
    return await this.page.inputValue(this.profileNameInput);
  }
}

module.exports = ProfilePage;

// src/pages/vocabulary/WordListPage.js
const BasePage = require('../base/BasePage');

class WordListPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.pageTitle = 'h1, h2';
    this.wordListContainer = '.container';
    this.searchInput = '#search-input';
    this.filterSelect = '#filter-select';
    this.wordCards = '.word-card';
    this.loadMoreButton = '#load-more-btn';
  }

  async navigateToWordList() {
    await this.navigate('/public/word-list.html');
  }

  async isWordListPageLoaded() {
    return await this.isElementVisible(this.pageTitle);
  }

  async searchWords(searchTerm) {
    if (await this.isElementVisible(this.searchInput)) {
      await this.fillInput(this.searchInput, searchTerm);
      await this.page.keyboard.press('Enter');
    }
  }

  async selectFilter(filterValue) {
    if (await this.isElementVisible(this.filterSelect)) {
      await this.page.selectOption(this.filterSelect, filterValue);
    }
  }

  async getWordCardsCount() {
    const cards = await this.page.locator(this.wordCards);
    return await cards.count();
  }

  async clickLoadMore() {
    if (await this.isElementVisible(this.loadMoreButton)) {
      await this.clickElement(this.loadMoreButton);
    }
  }
}

module.exports = WordListPage;

// src/pages/vocabulary/CustomVocabPage.js
const BasePage = require('../base/BasePage');

class CustomVocabPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.pageTitle = 'h1, h2';
    this.fileUploadInput = 'input[type="file"]';
    this.uploadButton = '#upload-btn';
    this.formatInstructions = '.format-instructions';
    this.uploadStatus = '.upload-status';
    this.previewArea = '.preview-area';
    this.useVocabButton = '#use-vocab-btn';
  }

  async navigateToCustomVocab() {
    await this.navigate('/public/custom-vocab.html');
  }

  async isCustomVocabPageLoaded() {
    return await this.isElementVisible(this.pageTitle);
  }

  async uploadFile(filePath) {
    if (await this.isElementVisible(this.fileUploadInput)) {
      await this.page.setInputFiles(this.fileUploadInput, filePath);
    }
  }

  async clickUpload() {
    await this.clickElement(this.uploadButton);
  }

  async isFormatInstructionsVisible() {
    return await this.isElementVisible(this.formatInstructions);
  }

  async getUploadStatus() {
    if (await this.isElementVisible(this.uploadStatus)) {
      return await this.getText(this.uploadStatus);
    }
    return '';
  }

  async isPreviewAreaVisible() {
    return await this.isElementVisible(this.previewArea);
  }

  async clickUseVocab() {
    if (await this.isElementVisible(this.useVocabButton)) {
      await this.clickElement(this.useVocabButton);
    }
  }
}

module.exports = CustomVocabPage;

// src/pages/vocabulary/MyWordsPage.js
const BasePage = require('../base/BasePage');

class MyWordsPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.pageTitle = 'h1, h2';
    this.myWordsContainer = '.my-words-container';
    this.addWordButton = '#add-word-btn';
    this.addWordModal = '#add-word-modal';
    this.wordInput = '#word-input';
    this.meaningInput = '#meaning-input';
    this.saveWordButton = '#save-word-btn';
    this.myWordsList = '.my-words-list';
    this.wordItem = '.word-item';
    this.deleteWordButton = '.delete-word-btn';
    this.editWordButton = '.edit-word-btn';
    this.searchMyWords = '#search-my-words';
    this.createFolderButton = '#create-folder-btn';
    this.folderList = '.folder-list';
  }

  async navigateToMyWords() {
    await this.navigate('/public/my-words.html');
  }

  async isMyWordsPageLoaded() {
    return await this.isElementVisible(this.pageTitle);
  }

  async clickAddWord() {
    if (await this.isElementVisible(this.addWordButton)) {
      await this.clickElement(this.addWordButton);
    }
  }

  async isAddWordModalVisible() {
    return await this.isElementVisible(this.addWordModal);
  }

  async fillWordForm(word, meaning) {
    await this.fillInput(this.wordInput, word);
    await this.fillInput(this.meaningInput, meaning);
  }

  async saveWord() {
    await this.clickElement(this.saveWordButton);
  }

  async getMyWordsCount() {
    if (await this.isElementVisible(this.wordItem)) {
      const items = await this.page.locator(this.wordItem);
      return await items.count();
    }
    return 0;
  }

  async searchMyWords(searchTerm) {
    if (await this.isElementVisible(this.searchMyWords)) {
      await this.fillInput(this.searchMyWords, searchTerm);
    }
  }

  async clickCreateFolder() {
    if (await this.isElementVisible(this.createFolderButton)) {
      await this.clickElement(this.createFolderButton);
    }
  }

  async isFolderListVisible() {
    return await this.isElementVisible(this.folderList);
  }
}

module.exports = MyWordsPage;

// src/pages/grammar/GrammarPage.js
const BasePage = require('../base/BasePage');

class GrammarPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.pageTitle = 'h1, h2';
    this.grammarContainer = '.grammar-container';
    this.lessonList = '.lesson-list';
    this.lessonItem = '.lesson-item';
    this.startLessonButton = '.start-lesson-btn';
    this.lessonContent = '.lesson-content';
    this.nextLessonButton = '#next-lesson-btn';
    this.previousLessonButton = '#previous-lesson-btn';
    this.lessonProgress = '.lesson-progress';
    this.exerciseSection = '.exercise-section';
    this.submitExerciseButton = '#submit-exercise-btn';
  }

  async navigateToGrammar() {
    await this.navigate('/public/grammar.html');
  }

  async isGrammarPageLoaded() {
    return await this.isElementVisible(this.pageTitle);
  }

  async getLessonsCount() {
    if (await this.isElementVisible(this.lessonItem)) {
      const lessons = await this.page.locator(this.lessonItem);
      return await lessons.count();
    }
    return 0;
  }

  async clickFirstLesson() {
    if (await this.isElementVisible(this.startLessonButton)) {
      await this.page.locator(this.startLessonButton).first().click();
    }
  }

  async isLessonContentVisible() {
    return await this.isElementVisible(this.lessonContent);
  }

  async clickNextLesson() {
    if (await this.isElementVisible(this.nextLessonButton)) {
      await this.clickElement(this.nextLessonButton);
    }
  }

  async isExerciseSectionVisible() {
    return await this.isElementVisible(this.exerciseSection);
  }

  async submitExercise() {
    if (await this.isElementVisible(this.submitExerciseButton)) {
      await this.clickElement(this.submitExerciseButton);
    }
  }
}

module.exports = GrammarPage;

// src/pages/leaderboard/LeaderboardPage.js
const BasePage = require('../base/BasePage');

class LeaderboardPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.pageTitle = 'h2';
    this.leaderboardContainer = '.card';
    this.loginRequiredMessage = '#login-required-message';
    this.leaderboardContent = '#leaderboard-content';
    this.leaderboardTable = '.leaderboard-table';
    this.playerRank = '.player-rank';
    this.playerName = '.player-name';
    this.playerScore = '.player-score';
    this.registerButton = 'a[href="register.html"]';
    this.loginButton = 'a[href="login.html"]';
  }

  async navigateToLeaderboard() {
    await this.navigate('/public/leaderboard.html');
  }

  async isLeaderboardPageLoaded() {
    return await this.isElementVisible(this.pageTitle);
  }

  async isLoginRequiredMessageVisible() {
    return await this.isElementVisible(this.loginRequiredMessage);
  }

  async isLeaderboardContentVisible() {
    return await this.isElementVisible(this.leaderboardContent);
  }

  async clickRegisterFromLeaderboard() {
    if (await this.isElementVisible(this.registerButton)) {
      await this.clickElement(this.registerButton);
    }
  }

  async clickLoginFromLeaderboard() {
    if (await this.isElementVisible(this.loginButton)) {
      await this.clickElement(this.loginButton);
    }
  }

  async getLeaderboardEntries() {
    if (await this.isElementVisible(this.playerRank)) {
      const entries = await this.page.locator(this.playerRank);
      return await entries.count();
    }
    return 0;
  }
}

module.exports = LeaderboardPage;

// src/pages/static/StaticPage.js
const BasePage = require('../base/BasePage');

class StaticPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.pageTitle = 'h1, h2';
    this.mainContainer = '.container';
    this.contentArea = '.content-area';
    this.navigationLinks = '.nav-link';
  }

  async navigateToAbout() {
    await this.navigate('/public/about.html');
  }

  async navigateToHowItWorks() {
    await this.navigate('/public/how-it-works.html');
  }

  async navigateToLearningTips() {
    await this.navigate('/public/learning-tips.html');
  }

  async navigateToFAQ() {
    await this.navigate('/public/faq.html');
  }

  async isPageLoaded() {
    return await this.isElementVisible(this.pageTitle);
  }

  async isMainContentVisible() {
    return await this.isElementVisible(this.mainContainer);
  }

  async getPageTitle() {
    if (await this.isElementVisible(this.pageTitle)) {
      return await this.getText(this.pageTitle);
    }
    return '';
  }

  async isNavigationVisible() {
    return await this.isElementVisible('.navbar');
  }
}

module.exports = StaticPage;