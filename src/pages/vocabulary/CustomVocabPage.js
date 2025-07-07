const BasePage = require('../base/BasePage');

class CustomVocabPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.fileInput = '#custom-vocab-file';
    this.fileNameLabel = '#file-name-label';
    this.uploadBtn = '#upload-custom-vocab-btn';
    this.uploadStatus = '#upload-status';
    this.uploadStatusContainer = '#upload-status-container';
    this.useDefaultBtn = '#use-default-btn';
    this.customFileLabel = '.custom-file-label';
    this.pageContainer = '.container'; // Use container instead, confirmed working
    this.cardShadow = '.card.shadow'; // Alternative confirmed working element
    this.uploadIcon = '.fas.fa-file-upload';
    this.alertInfo = '.alert.alert-info';
    this.supportedFormatsText = '.alert.alert-info span';
  }

  async navigateToCustomVocab() {
    await this.navigate('/public/custom-vocab.html');
    await this.waitForElement(this.fileInput); // Use file input instead of header
  }

  async isPageLoaded() {
    try {
      await this.waitForElement(this.fileInput, { timeout: 10000 });
      await this.waitForElement(this.uploadBtn, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async selectFile(filePath) {
    await this.waitForElement(this.fileInput);
    await this.page.setInputFiles(this.fileInput, filePath);
  }

  async getSelectedFileName() {
    try {
      await this.waitForElement(this.fileNameLabel, { timeout: 3000 });
      return await this.getText(this.fileNameLabel);
    } catch {
      return '';
    }
  }

  async getCustomFileLabelText() {
    try {
      await this.waitForElement(this.customFileLabel, { timeout: 3000 });
      return await this.getText(this.customFileLabel);
    } catch {
      return '';
    }
  }

  async clickUploadBtn() {
    await this.waitForElement(this.uploadBtn);
    await this.clickElement(this.uploadBtn);
  }

  async clickUseDefaultBtn() {
    await this.waitForElement(this.useDefaultBtn);
    await this.clickElement(this.useDefaultBtn);
  }

  async getUploadStatus() {
    try {
      await this.waitForElement(this.uploadStatus, { timeout: 10000 });
      return await this.getText(this.uploadStatus);
    } catch {
      return '';
    }
  }

  async isUploadStatusVisible() {
    return await this.isElementVisible(this.uploadStatusContainer);
  }

  async getUploadStatusClass() {
    try {
      await this.waitForElement(this.uploadStatusContainer, { timeout: 5000 });
      return await this.page.getAttribute(this.uploadStatusContainer, 'class');
    } catch {
      return '';
    }
  }

  async waitForUploadComplete(timeout = 15000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const statusElement = await this.page.locator(this.uploadStatus);
        if (await statusElement.isVisible()) {
          const text = await statusElement.textContent();
          if (text && (
            text.includes('successfully') || 
            text.includes('completed') || 
            text.includes('error') ||
            text.includes('failed') ||
            text.includes('default vocabulary') ||
            text.includes('processed')
          )) {
            return;
          }
        }
      } catch {
        // Continue polling
      }
      
      await this.page.waitForTimeout(500); // Check every 500ms
    }
    
    throw new Error(`Upload did not complete within ${timeout}ms`);
  }

  async getToastMessage() {
    try {
      await this.waitForElement('#toast-container .toast', { timeout: 5000 });
      return await this.getText('#toast-container .toast .toast-body');
    } catch {
      return null;
    }
  }

  async isFileInputEmpty() {
    const files = await this.page.locator(this.fileInput).inputValue();
    return files === '';
  }

  async isUploadBtnEnabled() {
    const isDisabled = await this.page.getAttribute(this.uploadBtn, 'disabled');
    return isDisabled === null;
  }

  async getSupportedFormatsText() {
    try {
      await this.waitForElement(this.supportedFormatsText);
      return await this.getText(this.supportedFormatsText);
    } catch {
      return '';
    }
  }

  async hasUploadIcon() {
    return await this.isElementVisible(this.uploadIcon);
  }

  async clearFileSelection() {
    await this.page.locator(this.fileInput).setInputFiles([]);
  }
}

module.exports = CustomVocabPage;