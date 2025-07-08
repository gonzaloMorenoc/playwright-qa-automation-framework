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