const { test, expect } = require('@playwright/test');
const RegisterPage = require('../../../src/pages/auth/RegisterPage');

// Import test data with error handling
let UserDataFactory, invalidPasswords, invalidEmails;
try {
  const testData = require('../../data/user-data');
  UserDataFactory = testData.UserDataFactory;
  invalidPasswords = testData.invalidPasswords;
  invalidEmails = testData.invalidEmails;
  
  // Debug log to verify data is loaded correctly
  console.log('Test data loaded successfully:');
  console.log('- UserDataFactory:', typeof UserDataFactory);
  console.log('- invalidPasswords length:', invalidPasswords?.length);
  console.log('- invalidEmails length:', invalidEmails?.length);
} catch (error) {
  console.error('Error loading test data:', error);
  throw error;
}

test.describe('User Registration', () => {
  let registerPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.navigateToRegister();
  });

  test.describe('Successful Registration Scenarios', () => {
    test('should register successfully with all fields filled', async () => {
      const userData = UserDataFactory.createValidUser();

      await registerPage.fillRegistrationForm(userData);
      await registerPage.submitForm();

      // Verify success (either toast message or redirect)
      const toastMessage = await registerPage.getToastMessage();
      if (toastMessage) {
        expect(toastMessage).toContain('success');
      } else {
        // Check if redirected to home page and logged in
        await expect(registerPage.page).toHaveURL(/.*index\.html/);
        expect(await registerPage.isLoggedIn()).toBeTruthy();
      }
    });

    test('should register successfully with minimum required fields', async () => {
      const userData = UserDataFactory.createMinimalUser();

      await registerPage.fillRegistrationForm(userData);
      await registerPage.submitForm();

      // Verify success
      const errorMessage = await registerPage.getErrorMessage();
      expect(errorMessage).toBeNull();
    });

    test('should register successfully without photo URL', async () => {
      const userData = UserDataFactory.createValidUser({ photo: '' });

      await registerPage.fillRegistrationForm(userData);
      await registerPage.submitForm();

      const errorMessage = await registerPage.getErrorMessage();
      expect(errorMessage).toBeNull();
    });
  });

  test.describe('Password Validation', () => {
    // Parametrized tests for invalid passwords
    invalidPasswords.forEach(({ password, expectedError }) => {
      test(`should reject password "${password}" - ${expectedError}`, async () => {
        const userData = UserDataFactory.createUserWithInvalidPassword({ password, expectedError });
        
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();

        const errorMessage = await registerPage.getErrorMessage();
        expect(errorMessage).toContain(expectedError);
      });
    });

    test('should accept strong password with special characters', async () => {
      const userData = UserDataFactory.createValidUser({ password: 'StrongP@ssw0rd!' });
      
      await registerPage.fillRegistrationForm(userData);
      await registerPage.submitForm();

      const errorMessage = await registerPage.getErrorMessage();
      expect(errorMessage).toBeNull();
    });
  });

  test.describe('Email Validation', () => {
    // Parametrized tests for invalid emails
    invalidEmails.forEach(({ email, expectedValidation }) => {
      test(`should reject invalid email "${email || 'empty'}" - ${expectedValidation}`, async () => {
        const userData = UserDataFactory.createUserWithInvalidEmail({ email, expectedValidation });
        
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();

        const validationMessage = await registerPage.getFieldValidationMessage(registerPage.emailInput);
        expect(validationMessage).toBeTruthy();
      });
    });

    test('should accept valid email formats', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.org',
        'test+tag@subdomain.domain.com',
        'user123@domain-name.com'
      ];

      for (const email of validEmails) {
        const userData = UserDataFactory.createValidUser({ email });
        
        await registerPage.clearForm();
        await registerPage.fillRegistrationForm(userData);
        
        // Just verify no validation error on the email field
        const validationMessage = await registerPage.getFieldValidationMessage(registerPage.emailInput);
        expect(validationMessage).toBeFalsy();
      }
    });
  });

  test.describe('Required Fields Validation', () => {
    const requiredFields = ['username', 'email', 'name', 'lastname', 'password'];
    
    requiredFields.forEach(field => {
      test(`should show validation error for missing ${field}`, async () => {
        const userData = UserDataFactory.createUserWithMissingField(field);
        
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();

        const fieldSelector = registerPage[`${field}Input`];
        const validationMessage = await registerPage.getFieldValidationMessage(fieldSelector);
        expect(validationMessage).toBeTruthy();
      });
    });

    test('should verify all required fields are marked as required', async () => {
      expect(await registerPage.isFieldRequired(registerPage.usernameInput)).toBeTruthy();
      expect(await registerPage.isFieldRequired(registerPage.emailInput)).toBeTruthy();
      expect(await registerPage.isFieldRequired(registerPage.nameInput)).toBeTruthy();
      expect(await registerPage.isFieldRequired(registerPage.lastnameInput)).toBeTruthy();
      expect(await registerPage.isFieldRequired(registerPage.passwordInput)).toBeTruthy();
      
      // Photo should not be required
      expect(await registerPage.isFieldRequired(registerPage.photoInput)).toBeFalsy();
    });
  });

  test.describe('Duplicate User Scenarios', () => {
    test('should reject registration with existing username', async ({ browser }) => {
      // First, register a user
      const existingUserData = UserDataFactory.createValidUser();

      await registerPage.fillRegistrationForm(existingUserData);
      await registerPage.submitForm();

      // Wait for potential success
      await registerPage.page.waitForTimeout(2000);

      // Try to register with the same username in a new page context
      const newPage = await browser.newPage();
      const newRegisterPage = new RegisterPage(newPage);
      await newRegisterPage.navigateToRegister();

      const duplicateUserData = UserDataFactory.createValidUser({
        username: existingUserData.username, // Same username
        email: `different${Date.now()}@example.com` // Different email
      });

      await newRegisterPage.fillRegistrationForm(duplicateUserData);
      await newRegisterPage.submitForm();

      const errorMessage = await newRegisterPage.getErrorMessage();
      expect(errorMessage).toContain('username');
      
      await newPage.close();
    });

    test('should reject registration with existing email', async ({ browser }) => {
      // First, register a user
      const existingUserData = UserDataFactory.createValidUser();

      await registerPage.fillRegistrationForm(existingUserData);
      await registerPage.submitForm();

      // Wait for potential success
      await registerPage.page.waitForTimeout(2000);

      // Try to register with the same email in a new page context
      const newPage = await browser.newPage();
      const newRegisterPage = new RegisterPage(newPage);
      await newRegisterPage.navigateToRegister();

      const duplicateUserData = UserDataFactory.createValidUser({
        username: `different${Date.now()}`, // Different username
        email: existingUserData.email // Same email
      });

      await newRegisterPage.fillRegistrationForm(duplicateUserData);
      await newRegisterPage.submitForm();

      const errorMessage = await newRegisterPage.getErrorMessage();
      expect(errorMessage).toContain('email');
      
      await newPage.close();
    });
  });

  test.describe('UI Interactions', () => {
    test('should navigate to login page when clicking login link', async () => {
      await registerPage.clickLoginLink();
      await expect(registerPage.page).toHaveURL(/.*login\.html/);
    });

    test('should clear form when explicitly cleared', async () => {
      const userData = UserDataFactory.createValidUser();

      await registerPage.fillRegistrationForm(userData);
      
      // Verify fields are filled
      expect(await registerPage.getFieldValue(registerPage.usernameInput)).toBe(userData.username);
      expect(await registerPage.getFieldValue(registerPage.emailInput)).toBe(userData.email);

      await registerPage.clearForm();

      // Verify fields are cleared
      expect(await registerPage.getFieldValue(registerPage.usernameInput)).toBe('');
      expect(await registerPage.getFieldValue(registerPage.emailInput)).toBe('');
    });

    test('should have proper form structure and accessibility', async () => {
      // Check if form exists and is visible
      expect(await registerPage.isFormVisible()).toBeTruthy();

      // Check if all input fields exist
      await expect(registerPage.page.locator(registerPage.usernameInput)).toBeVisible();
      await expect(registerPage.page.locator(registerPage.emailInput)).toBeVisible();
      await expect(registerPage.page.locator(registerPage.nameInput)).toBeVisible();
      await expect(registerPage.page.locator(registerPage.lastnameInput)).toBeVisible();
      await expect(registerPage.page.locator(registerPage.passwordInput)).toBeVisible();
      await expect(registerPage.page.locator(registerPage.submitButton)).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle very long input values', async () => {
      const userData = UserDataFactory.createBoundaryTestUser('maxLength');
      
      await registerPage.fillRegistrationForm(userData);
      
      // Should either accept or show validation error, not crash
      await registerPage.submitForm();
      
      // Just verify the page is still functional
      expect(await registerPage.isFormVisible()).toBeTruthy();
    });

    test('should handle special characters in input fields', async () => {
      const userData = UserDataFactory.createBoundaryTestUser('specialChars');

      await registerPage.fillRegistrationForm(userData);
      await registerPage.submitForm();
      
      // Verify the page handles special characters gracefully
      expect(await registerPage.isFormVisible()).toBeTruthy();
    });

    test('should handle unicode characters', async () => {
      const userData = UserDataFactory.createBoundaryTestUser('unicode');

      await registerPage.fillRegistrationForm(userData);
      await registerPage.submitForm();

      // Verify the page handles unicode gracefully
      expect(await registerPage.isFormVisible()).toBeTruthy();
    });

    test('should handle rapid form submissions', async () => {
      const userData = UserDataFactory.createValidUser();

      await registerPage.fillRegistrationForm(userData);
      
      // Submit multiple times rapidly
      await registerPage.submitForm();
      await registerPage.submitForm();
      await registerPage.submitForm();

      // Should handle gracefully without crashes
      expect(await registerPage.isFormVisible()).toBeTruthy();
    });
  });
});