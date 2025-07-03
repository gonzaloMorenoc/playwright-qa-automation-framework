const BasePage = require('../base/BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.startLearningBtn = '#play-btn';
    this.navHome = '#nav-home';
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
}

module.exports = HomePage;