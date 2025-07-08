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