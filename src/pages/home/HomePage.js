const BasePage = require('../base/BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Existing selectors
    this.startLearningBtn = '#play-btn';
    this.navHome = '#nav-home';
    
    // Vocabulary modal selectors
    this.vocabularyTypeModal = '#vocabulary-type-modal';
    this.basicVocabOption = 'input[value="basic"]';
    this.phrasalVerbsOption = 'input[value="phrasal-verbs"]';
    this.idiomsOption = 'input[value="idioms"]';
    this.irregularVerbsOption = 'input[value="irregular-verbs"]';
    this.startGameFromModalBtn = '#start-game-from-modal';
    
    // Home page elements
    this.appLogo = '#app-logo';
    this.heroSection = '.hero-section';
    this.featuresSection = '.features-section';
    this.navbarBrand = '.navbar-brand';
  }

  async navigateToHome() {
    await this.navigate('/');
  }

  async clickStartLearning() {
    await this.clickElement(this.startLearningBtn);
  }

  async clickNavHome() {
    await this.clickElement(this.navHome);
  }

  async isHomePageLoaded() {
    return await this.isElementVisible(this.startLearningBtn);
  }

  // Vocabulary modal methods (referenced in tests)
  async isVocabularyTypeModalVisible() {
    try {
      await this.page.waitForSelector(this.vocabularyTypeModal, { timeout: 5000 });
      return await this.isElementVisible(this.vocabularyTypeModal);
    } catch {
      return false;
    }
  }

  async waitForVocabularyModal() {
    await this.waitForElement(this.vocabularyTypeModal);
  }

  async selectVocabularyType(type = 'basic') {
    const selectorMap = {
      'basic': this.basicVocabOption,
      'phrasal-verbs': this.phrasalVerbsOption,
      'idioms': this.idiomsOption,
      'irregular-verbs': this.irregularVerbsOption
    };

    const selector = selectorMap[type] || this.basicVocabOption;
    
    if (await this.isElementVisible(selector)) {
      await this.clickElement(selector);
    }
  }

  async clickStartGameFromModal() {
    if (await this.isElementVisible(this.startGameFromModalBtn)) {
      await this.clickElement(this.startGameFromModalBtn);
    }
  }

  // Additional utility methods
  async isAppLogoVisible() {
    return await this.isElementVisible(this.appLogo);
  }

  async isNavbarVisible() {
    return await this.isElementVisible(this.navbarBrand);
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async scrollToFeatures() {
    if (await this.isElementVisible(this.featuresSection)) {
      await this.page.locator(this.featuresSection).scrollIntoViewIfNeeded();
    }
  }

  // Navigation methods
  async clickNavigationLink(linkId) {
    const selector = `#${linkId}`;
    if (await this.isElementVisible(selector)) {
      await this.clickElement(selector);
    }
  }

  async isNavigationLinkVisible(linkId) {
    const selector = `#${linkId}`;
    return await this.isElementVisible(selector);
  }
}

module.exports = HomePage;