const BasePage = require('../base/BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.loginForm = '#login-form';
    this.usernameInput = '#login-username';
    this.passwordInput = '#login-password';
    this.submitButton = 'button[type="submit"]';
    this.errorContainer = '#login-error';
    this.toastContainer = '#toast-container';
    this.registerLink = 'a[href="register.html"]';
    this.homeLink = 'a[href="../index.html"]';
  }

  async navigateToLogin() {
    await this.navigate('/public/login.html');
    await this.waitForElement(this.loginForm);
  }

  async fillUsername(username) {
    await this.fillInput(this.usernameInput, username);
  }

  async fillPassword(password) {
    await this.fillInput(this.passwordInput, password);
  }

  async fillLoginForm(credentials) {
    if (credentials.username) await this.fillUsername(credentials.username);
    if (credentials.password) await this.fillPassword(credentials.password);
  }

  async submitForm() {
    await this.clickElement(this.submitButton);
  }

  async login(credentials) {
    await this.fillLoginForm(credentials);
    await this.submitForm();
  }

  async getErrorMessage() {
    try {
      await this.waitForElement(this.errorContainer, { timeout: 5000 });
      return await this.getText(this.errorContainer);
    } catch {
      return null;
    }
  }

  async getToastMessage() {
    try {
      await this.waitForElement(`${this.toastContainer} .toast`, { timeout: 5000 });
      return await this.getText(`${this.toastContainer} .toast .toast-body`);
    } catch {
      return null;
    }
  }

  async isErrorVisible() {
    return await this.isElementVisible(this.errorContainer);
  }

  async isFormVisible() {
    return await this.isElementVisible(this.loginForm);
  }

  async clickRegisterLink() {
    await this.clickElement(this.registerLink);
  }

  async isLoggedIn() {
    const token = await this.page.evaluate(() => localStorage.getItem('authToken'));
    return token !== null;
  }

  async waitForRedirect() {
    await this.page.waitForURL('**/index.html', { timeout: 10000 });
  }

  async clearForm() {
    await this.page.fill(this.usernameInput, '');
    await this.page.fill(this.passwordInput, '');
  }

  async getFieldValue(fieldSelector) {
    await this.waitForElement(fieldSelector);
    return await this.page.inputValue(fieldSelector);
  }

  async isFieldRequired(fieldSelector) {
    await this.waitForElement(fieldSelector);
    return await this.page.getAttribute(fieldSelector, 'required') !== null;
  }
}

module.exports = LoginPage;