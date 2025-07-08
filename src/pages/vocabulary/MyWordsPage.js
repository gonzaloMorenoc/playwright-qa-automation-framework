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