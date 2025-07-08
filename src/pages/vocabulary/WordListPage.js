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