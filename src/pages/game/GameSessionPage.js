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

  // Additional selectors
  get favoriteButton() { return '#favorito-btn'; }
  get addToMyWordsButton() { return '#add-to-mywords-btn'; }
  get addToMyWordsContainer() { return '#add-to-mywords-container'; }
  get restartButton() { return '#restart-btn'; }
  get progressCounter() { return '.progress-counter'; }
  get nextWordButton() { return '.next-word-btn'; }
  get sessionInfo() { return '.session-info'; }
  get registrationWarningModal() { return '#not-logged-in-modal, .registration-warning, .auth-warning'; }
  get toastWarning() { return '.toast-warning, .toast.bg-warning'; }

  async isFavoriteButtonAlwaysVisible() {
    try {
      // Favorite button should always be visible, regardless of auth state
      const element = await this.page.locator(this.favoriteButton);
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  async isFavoriteButtonVisible() {
    // Legacy method - keeping for backward compatibility
    return await this.isFavoriteButtonAlwaysVisible();
  }

  async hasRegistrationWarning() {
    try {
      // Wait a bit for potential modal/toast to appear
      await this.page.waitForTimeout(1500);
      
      // Check for modal
      const modalVisible = await this.page.locator(this.registrationWarningModal).isVisible().catch(() => false);
      if (modalVisible) return true;
      
      // Check for toast warning
      const toastVisible = await this.page.locator(this.toastWarning).isVisible().catch(() => false);
      if (toastVisible) return true;
      
      // Check for any element containing registration/login text
      const hasRegistrationText = await this.page.locator('text=/register|login|sign up|not logged/i').isVisible().catch(() => false);
      
      return hasRegistrationText;
    } catch {
      return false;
    }
  }

  async isAddToMyWordsVisible() {
    try {
      // Check the container first since it controls visibility
      await this.page.waitForTimeout(1000);
      
      const container = await this.page.locator(this.addToMyWordsContainer);
      const containerVisible = await container.isVisible();
      
      if (!containerVisible) return false;
      
      // Check if the container is explicitly hidden
      const containerStyle = await container.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      
      return containerStyle;
    } catch {
      return false;
    }
  }

  async clickFavoriteButton() {
    await this.clickElement(this.favoriteButton);
  }

  async clickAddToMyWords() {
    await this.clickElement(this.addToMyWordsButton);
  }

  async clickRestartSession() {
    await this.clickElement(this.restartButton);
  }

  async isFavoriteActive() {
    try {
      const element = await this.page.locator(this.favoriteButton);
      const classes = await element.getAttribute('class');
      return classes.includes('active') || classes.includes('favorited');
    } catch {
      return false;
    }
  }

  async isWordAddedToMyWords() {
    try {
      await this.page.waitForSelector('.toast-success', { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isNextWordAvailable() {
    try {
      await this.page.waitForSelector(this.revealBtn, { 
        timeout: 5000,
        state: 'visible'
      });
      return true;
    } catch {
      return false;
    }
  }

  async getProgressCount() {
    try {
      const element = await this.page.locator(this.progressCounter);
      const text = await element.textContent();
      return text.trim();
    } catch {
      return '0';
    }
  }

  async navigateToHomeAndReturn() {
    await this.clickNavHome();
    await this.page.waitForURL(/.*index\.html/);
    await this.page.click('#play-btn');
    await this.waitForGameSessionToLoad();
  }

  async isGameSessionActive() {
    return await this.isElementVisible(this.revealBtn);
  }

  async isSessionRestarted() {
    try {
      await this.waitForGameSessionToLoad();
      return await this.isElementVisible(this.revealBtn);
    } catch {
      return false;
    }
  }

  async isUserStillAuthenticated() {
    const authToken = await this.page.evaluate(() => localStorage.getItem('authToken'));
    return !!authToken;
  }

  async waitForToastMessage(timeout = 3000) {
    try {
      await this.page.waitForSelector('.toast', { timeout });
      return true;
    } catch {
      return false;
    }
  }

  async getToastMessage() {
    try {
      const toast = await this.page.locator('.toast-body');
      return await toast.textContent();
    } catch {
      return null;
    }
  }
}

module.exports = GameSessionPage;