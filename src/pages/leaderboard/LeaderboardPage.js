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