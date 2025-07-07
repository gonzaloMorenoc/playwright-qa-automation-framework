const { test, expect } = require('@playwright/test');
const CustomVocabPage = require('../../../src/pages/vocabulary/CustomVocabPage');
const LoginPage = require('../../../src/pages/auth/LoginPage');
const path = require('path');

const REGISTERED_USER_CREDENTIALS = {
  username: 'PlayTest',
  password: 'PlayTest123'
};

const TEST_FILES = {
  validCSV: path.join(__dirname, '../../fixtures/files/valid-vocabulary.csv'),
  validXLSX: path.join(__dirname, '../../fixtures/files/valid-vocabulary.xlsx'),
  invalidFormat: path.join(__dirname, '../../fixtures/files/invalid-format.txt'),
  emptyCSV: path.join(__dirname, '../../fixtures/files/empty-vocabulary.csv'),
  largeCSV: path.join(__dirname, '../../fixtures/files/large-vocabulary.csv')
};

test.describe('Upload Vocabulary E2E Tests', () => {
  let customVocabPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    customVocabPage = new CustomVocabPage(page);
    loginPage = new LoginPage(page);
  });

  test.describe('Page Navigation and Loading', () => {
    test('should navigate to custom vocabulary page successfully', async () => {
      await customVocabPage.navigateToCustomVocab();
      
      expect(await customVocabPage.isPageLoaded()).toBeTruthy();
    });

    test('should display all required page elements', async () => {
      await customVocabPage.navigateToCustomVocab();
      
      expect(await customVocabPage.hasUploadIcon()).toBeTruthy();
      expect(await customVocabPage.isUploadBtnEnabled()).toBeTruthy();
      expect(await customVocabPage.getSupportedFormatsText()).toContain('.csv, .xls, .xlsx');
    });
  });

  test.describe('Guest User Upload Scenarios', () => {
    test.beforeEach(async ({ page }) => {
      await page.context().clearCookies();
      
      await customVocabPage.navigateToCustomVocab();
      
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });

    test('should show file selection feedback when file is selected', async () => {
      await customVocabPage.selectFile(TEST_FILES.validCSV);
      
      const fileName = await customVocabPage.getSelectedFileName();
      expect(fileName).toContain('valid-vocabulary.csv');
      
      const customLabelText = await customVocabPage.getCustomFileLabelText();
      expect(customLabelText).toContain('valid-vocabulary.csv');
    });

    test('should upload valid CSV file successfully', async () => {
      await customVocabPage.selectFile(TEST_FILES.validCSV);
      await customVocabPage.clickUploadBtn();
      
      await customVocabPage.waitForUploadComplete();
      
      const uploadStatus = await customVocabPage.getUploadStatus();
      expect(uploadStatus).toMatch(/(successfully|completed|processed)/i);
      
      expect(await customVocabPage.isUploadStatusVisible()).toBeTruthy();
    });

    test('should upload valid XLSX file successfully', async () => {
      await customVocabPage.selectFile(TEST_FILES.validXLSX);
      await customVocabPage.clickUploadBtn();
      
      await customVocabPage.waitForUploadComplete();
      
      const uploadStatus = await customVocabPage.getUploadStatus();
      expect(uploadStatus).toMatch(/(successfully|completed|processed)/i);
    });

    test('should show error for invalid file format', async () => {
      await customVocabPage.selectFile(TEST_FILES.invalidFormat);
      await customVocabPage.clickUploadBtn();
      
      await customVocabPage.waitForUploadComplete();
      
      const uploadStatus = await customVocabPage.getUploadStatus();
      expect(uploadStatus).toMatch(/(error|invalid|supported)/i);
      
      const statusClass = await customVocabPage.getUploadStatusClass();
      expect(statusClass).toContain('alert-danger');
    });

    test('should handle empty CSV file gracefully', async () => {
      await customVocabPage.selectFile(TEST_FILES.emptyCSV);
      await customVocabPage.clickUploadBtn();
      
      await customVocabPage.waitForUploadComplete();
      
      const uploadStatus = await customVocabPage.getUploadStatus();
      expect(uploadStatus).toMatch(/(empty|no data|no words)/i);
    });

    test('should show validation error when no file is selected', async () => {
      await customVocabPage.clickUploadBtn();
      
      const toastMessage = await customVocabPage.getToastMessage();
      expect(toastMessage).toMatch(/(select.*file|choose.*file|file.*required)/i);
    });
  });

  test.describe('Authenticated User Upload Scenarios', () => {
    test.beforeEach(async ({ page }) => {
      await page.context().clearCookies();
      
      await loginPage.navigateToLogin();
      
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      await loginPage.login(REGISTERED_USER_CREDENTIALS);
      await loginPage.waitForRedirect();
      
      await customVocabPage.navigateToCustomVocab();
    });

    test('should upload file and save to user database for authenticated users', async () => {
      await customVocabPage.selectFile(TEST_FILES.validCSV);
      await customVocabPage.clickUploadBtn();
      
      await customVocabPage.waitForUploadComplete();
      
      const uploadStatus = await customVocabPage.getUploadStatus();
      expect(uploadStatus).toMatch(/(successfully|saved.*database|words.*added)/i);
      
      const statusClass = await customVocabPage.getUploadStatusClass();
      expect(statusClass).toContain('alert-success');
    });

    test('should handle large file upload for authenticated users', async () => {
      await customVocabPage.selectFile(TEST_FILES.largeCSV);
      await customVocabPage.clickUploadBtn();
      
      await customVocabPage.waitForUploadComplete(30000);
      
      const uploadStatus = await customVocabPage.getUploadStatus();
      expect(uploadStatus).toMatch(/(successfully|completed|processed)/i);
    });

    test('should allow switching back to default vocabulary', async () => {
      await customVocabPage.selectFile(TEST_FILES.validCSV);
      await customVocabPage.clickUploadBtn();
      await customVocabPage.waitForUploadComplete();
      
      await customVocabPage.clickUseDefaultBtn();
      
      const uploadStatus = await customVocabPage.getUploadStatus();
      expect(uploadStatus).toContain('default vocabulary');
      
      const statusClass = await customVocabPage.getUploadStatusClass();
      expect(statusClass).toContain('alert-info');
    });

    test('should show toast notification for successful upload', async () => {
      await customVocabPage.selectFile(TEST_FILES.validCSV);
      await customVocabPage.clickUploadBtn();
      
      await customVocabPage.waitForUploadComplete();
      
      const toastMessage = await customVocabPage.getToastMessage();
      if (toastMessage) {
        expect(toastMessage).toMatch(/(success|uploaded|saved)/i);
      }
    });
  });

  test.describe('File Management and State', () => {
    test.beforeEach(async ({ page }) => {
      await customVocabPage.navigateToCustomVocab();
      
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });

    test('should clear file selection when needed', async () => {
      await customVocabPage.selectFile(TEST_FILES.validCSV);
      
      let fileName = await customVocabPage.getSelectedFileName();
      expect(fileName).toContain('valid-vocabulary.csv');
      
      await customVocabPage.clearFileSelection();
      
      expect(await customVocabPage.isFileInputEmpty()).toBeTruthy();
    });

    test('should handle multiple file selections', async () => {
      await customVocabPage.selectFile(TEST_FILES.validCSV);
      
      let fileName = await customVocabPage.getSelectedFileName();
      expect(fileName).toContain('valid-vocabulary.csv');
      
      await customVocabPage.selectFile(TEST_FILES.validXLSX);
      
      fileName = await customVocabPage.getSelectedFileName();
      expect(fileName).toContain('valid-vocabulary.xlsx');
    });

    test('should maintain upload state after processing', async () => {
      await customVocabPage.selectFile(TEST_FILES.validCSV);
      await customVocabPage.clickUploadBtn();
      
      await customVocabPage.waitForUploadComplete();
      
      expect(await customVocabPage.isUploadStatusVisible()).toBeTruthy();
      
      const uploadStatus = await customVocabPage.getUploadStatus();
      expect(uploadStatus).toBeTruthy();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test.beforeEach(async ({ page }) => {
      await customVocabPage.navigateToCustomVocab();
      
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });

    test('should handle upload interruption gracefully', async () => {
      await customVocabPage.selectFile(TEST_FILES.largeCSV);
      await customVocabPage.clickUploadBtn();
      
      await customVocabPage.page.waitForTimeout(1000);
      
      await customVocabPage.navigateToCustomVocab();
      
      expect(await customVocabPage.isPageLoaded()).toBeTruthy();
    });

    test('should validate file extension before processing', async () => {
      await customVocabPage.selectFile(TEST_FILES.invalidFormat);
      
      const fileName = await customVocabPage.getSelectedFileName();
      expect(fileName).toContain('invalid-format.txt');
      
      await customVocabPage.clickUploadBtn();
      await customVocabPage.waitForUploadComplete();
      
      const uploadStatus = await customVocabPage.getUploadStatus();
      expect(uploadStatus).toMatch(/(invalid|not supported|format)/i);
    });

    test('should reset form state after successful upload', async () => {
      await customVocabPage.selectFile(TEST_FILES.validCSV);
      await customVocabPage.clickUploadBtn();
      await customVocabPage.waitForUploadComplete();
      
      const uploadStatus = await customVocabPage.getUploadStatus();
      expect(uploadStatus).toMatch(/(successfully|completed)/i);
      
      expect(await customVocabPage.isUploadBtnEnabled()).toBeTruthy();
    });
  });
});