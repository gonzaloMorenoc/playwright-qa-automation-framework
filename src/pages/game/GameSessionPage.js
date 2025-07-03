const BasePage = require('../base/BasePage');

class GameSessionPage extends BasePage {
  constructor(page) {
    super(page);
    this.revealBtn = '#revelar-btn';
    this.correctBtn = '#correcto-btn';
    this.incorrectBtn = '#incorrecto-btn';
    this.answerButtons = '.answer-buttons';
    this.navHome = '#nav-home';
  }

  async waitForGameSessionToLoad() {
    await this.waitForElement(this.revealBtn);
  }

  async clickReveal() {
    await this.clickElement(this.revealBtn);
  }

  async waitForAnswerButtons() {
    await this.waitForElement(this.answerButtons);
  }

  async clickCorrect() {
    await this.clickElement(this.correctBtn);
  }

  async clickIncorrect() {
    await this.clickElement(this.incorrectBtn);
  }

  async clickNavHome() {
    await this.clickElement(this.navHome);
  }

  async isAnswerButtonsVisible() {
    return await this.isElementVisible(this.correctBtn);
  }
}

module.exports = GameSessionPage;