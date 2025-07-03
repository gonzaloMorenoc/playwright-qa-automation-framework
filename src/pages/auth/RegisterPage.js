const BasePage = require('../base/BasePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Form elements
    this.registerForm = '#register-form';
    this.usernameInput = '#reg-username';
    this.emailInput = '#reg-email';
    this.nameInput = '#reg-name';
    this.lastnameInput = '#reg-lastname';
    this.photoInput = '#reg-photo';
    this.passwordInput = '#reg-password';
    this.submitButton = 'button[type="submit"]';
    
    // Error and success elements
    this.errorContainer = '#register-error';
    this.toastContainer = '#toast-container';
    
    // Navigation elements
    this.loginLink = 'a[href="login.html"]';
    this.homeLink = 'a[href="../index.html"]';
  }

  async navigateToRegister() {
    await this.navigate('/public/register.html');
    await this.waitForElement(this.registerForm);
  }

  async fillUsername(username) {
    await this.fillInput(this.usernameInput, username);
  }

  async fillEmail(email) {
    await this.fillInput(this.emailInput, email);
  }

  async fillName(name) {
    await this.fillInput(this.nameInput, name);
  }

  async fillLastname(lastname) {
    await this.fillInput(this.lastnameInput, lastname);
  }

  async fillPhoto(photoUrl) {
    await this.fillInput(this.photoInput, photoUrl);
  }

  async fillPassword(password) {
    await this.fillInput(this.passwordInput, password);
  }

  async fillRegistrationForm(userData) {
    if (userData.username) await this.fillUsername(userData.username);
    if (userData.email) await this.fillEmail(userData.email);
    if (userData.name) await this.fillName(userData.name);
    if (userData.lastname) await this.fillLastname(userData.lastname);
    if (userData.photo) await this.fillPhoto(userData.photo);
    if (userData.password) await this.fillPassword(userData.password);
  }

  async submitForm() {
    await this.clickElement(this.submitButton);
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
    return await this.isElementVisible(this.registerForm);
  }

  async getFieldValue(fieldSelector) {
    await this.waitForElement(fieldSelector);
    return await this.page.inputValue(fieldSelector);
  }

  async isFieldRequired(fieldSelector) {
    await this.waitForElement(fieldSelector);
    return await this.page.getAttribute(fieldSelector, 'required') !== null;
  }

  async getFieldValidationMessage(fieldSelector) {
    await this.waitForElement(fieldSelector);
    return await this.page.locator(fieldSelector).evaluate(el => el.validationMessage);
  }

  async clickLoginLink() {
    await this.clickElement(this.loginLink);
  }

  async waitForRedirect() {
    await this.page.waitForURL('**/index.html', { timeout: 10000 });
  }

  async isLoggedIn() {
    // Check if auth token exists and navigation shows logged in state
    const token = await this.page.evaluate(() => localStorage.getItem('authToken'));
    return token !== null;
  }

  async clearForm() {
    await this.page.fill(this.usernameInput, '');
    await this.page.fill(this.emailInput, '');
    await this.page.fill(this.nameInput, '');
    await this.page.fill(this.lastnameInput, '');
    await this.page.fill(this.photoInput, '');
    await this.page.fill(this.passwordInput, '');
  }
}

module.exports = RegisterPage;