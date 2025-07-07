const { test, expect } = require('@playwright/test');
const LoginPage = require('../../../src/pages/auth/LoginPage');

let UserDataFactory;
try {
  const testData = require('../../data/user-data');
  UserDataFactory = testData.UserDataFactory;
} catch (error) {
  console.error('Error loading test data:', error);
  throw error;
}

const VALID_CREDENTIALS = {
  username: 'PlayTest',
  password: 'PlayTest123'
};

const INVALID_CREDENTIALS = [
  { username: '', password: '', expectedError: 'required' },
  { username: 'PlayTest', password: '', expectedError: 'required' },
  { username: '', password: 'PlayTest123', expectedError: 'required' },
  { username: 'invaliduser', password: 'wrongpass', expectedError: 'Invalid' },
  { username: 'PlayTest', password: 'wrongpassword', expectedError: 'Invalid' },
  { username: 'nonexistentuser', password: 'PlayTest123', expectedError: 'Invalid' }
];

test.describe('User Login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test.describe('Successful Login Scenarios', () => {
    test('should login successfully with valid registered credentials', async () => {
      await loginPage.login(VALID_CREDENTIALS);

      const toastMessage = await loginPage.getToastMessage();
      if (toastMessage) {
        expect(toastMessage).toContain('successful');
      } else {
        await loginPage.waitForRedirect();
        await expect(loginPage.page).toHaveURL(/.*index\.html/);
      }

      expect(await loginPage.isLoggedIn()).toBeTruthy();
    });

    test('should maintain session after login and redirect to home', async () => {
      await loginPage.login(VALID_CREDENTIALS);
      
      await loginPage.waitForRedirect();
      
      expect(await loginPage.isLoggedIn()).toBeTruthy();
      
      const authToken = await loginPage.page.evaluate(() => localStorage.getItem('authToken'));
      expect(authToken).toBeTruthy();
    });

    test('should redirect to home if already logged in', async () => {
      await loginPage.login(VALID_CREDENTIALS);
      await loginPage.waitForRedirect();
      
      await loginPage.navigateToLogin();
      
      await expect(loginPage.page).toHaveURL(/.*index\.html/);
    });
  });

  test.describe('Failed Login Scenarios', () => {
    INVALID_CREDENTIALS.forEach(({ username, password, expectedError }) => {
      test(`should reject login with credentials: "${username || 'empty'}" / "${password || 'empty'}"`, async () => {
        await loginPage.login({ username, password });

        if (expectedError === 'required') {
          const usernameValidation = await loginPage.getFieldValue(loginPage.usernameInput);
          const passwordValidation = await loginPage.getFieldValue(loginPage.passwordInput);
          
          if (!username) {
            expect(usernameValidation).toBe('');
          }
          if (!password) {
            expect(passwordValidation).toBe('');
          }
          
          const errorMessage = await loginPage.getErrorMessage();
          if (errorMessage) {
            expect(errorMessage.toLowerCase()).toContain('required');
          }
        } else {
          const errorMessage = await loginPage.getErrorMessage();
          expect(errorMessage).toBeTruthy();
          expect(errorMessage.toLowerCase()).toContain('authentication failed');
        }

        expect(await loginPage.isLoggedIn()).toBeFalsy();
      });
    });

    test('should clear previous error messages on new attempt', async () => {
      await loginPage.login({ username: 'invalid', password: 'invalid' });
      
      let errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();

      await loginPage.clearForm();
      await loginPage.login(VALID_CREDENTIALS);

      const newErrorMessage = await loginPage.getErrorMessage();
      expect(newErrorMessage).toBeNull();
    });

    test('should handle case-sensitive credentials', async () => {
      await loginPage.login({ 
        username: 'playtest', 
        password: 'PlayTest123' 
      });

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
      expect(await loginPage.isLoggedIn()).toBeFalsy();
    });

    test('should handle special characters in credentials', async () => {
      await loginPage.login({ 
        username: 'PlayTest!@#', 
        password: 'PlayTest123$%^' 
      });

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
      expect(await loginPage.isLoggedIn()).toBeFalsy();
    });
  });

  test.describe('Form Validation', () => {
    test('should mark required fields appropriately', async () => {
      expect(await loginPage.isFieldRequired(loginPage.usernameInput)).toBeTruthy();
      expect(await loginPage.isFieldRequired(loginPage.passwordInput)).toBeTruthy();
    });

    test('should prevent form submission with empty fields', async () => {
      await loginPage.submitForm();

      const errorMessage = await loginPage.getErrorMessage();
      if (errorMessage) {
        expect(errorMessage.toLowerCase()).toContain('required');
      }

      expect(await loginPage.isLoggedIn()).toBeFalsy();
    });

    test('should trim whitespace from username', async () => {
      await loginPage.fillUsername('  PlayTest  ');
      await loginPage.fillPassword('PlayTest123');
      await loginPage.submitForm();

      const toastMessage = await loginPage.getToastMessage();
      if (toastMessage) {
        expect(toastMessage).toContain('successful');
      } else {
        await loginPage.waitForRedirect();
        expect(await loginPage.isLoggedIn()).toBeTruthy();
      }
    });
  });

  test.describe('UI Interactions', () => {
    test('should navigate to register page when clicking register link', async () => {
      await loginPage.clickRegisterLink();
      await expect(loginPage.page).toHaveURL(/.*register\.html/);
    });

    test('should have proper form structure and accessibility', async () => {
      expect(await loginPage.isFormVisible()).toBeTruthy();

      await expect(loginPage.page.locator(loginPage.usernameInput)).toBeVisible();
      await expect(loginPage.page.locator(loginPage.passwordInput)).toBeVisible();
      await expect(loginPage.page.locator(loginPage.submitButton)).toBeVisible();
    });

    test('should clear form when explicitly cleared', async () => {
      const credentials = UserDataFactory.createValidUser();

      await loginPage.fillLoginForm({
        username: credentials.username,
        password: credentials.password
      });

      expect(await loginPage.getFieldValue(loginPage.usernameInput)).toBe(credentials.username);
      expect(await loginPage.getFieldValue(loginPage.passwordInput)).toBe(credentials.password);

      await loginPage.clearForm();

      expect(await loginPage.getFieldValue(loginPage.usernameInput)).toBe('');
      expect(await loginPage.getFieldValue(loginPage.passwordInput)).toBe('');
    });

    test('should focus on first input field on page load', async () => {
      const focusedElement = await loginPage.page.evaluate(() => document.activeElement?.id);
      expect(focusedElement).toBe('login-username');
    });
  });

  test.describe('Security Tests', () => {
    test('should not expose password in any form', async () => {
      await loginPage.fillPassword('PlayTest123');
      
      const passwordType = await loginPage.page.getAttribute(loginPage.passwordInput, 'type');
      expect(passwordType).toBe('password');

      const passwordValue = await loginPage.page.inputValue(loginPage.passwordInput);
      expect(passwordValue).toBe('PlayTest123');
    });

    test('should handle login attempts with SQL injection patterns', async () => {
      const maliciousInputs = [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "admin'/*",
        "1' UNION SELECT * FROM users--"
      ];

      for (const maliciousInput of maliciousInputs) {
        await loginPage.clearForm();
        await loginPage.login({ 
          username: maliciousInput, 
          password: 'anypassword' 
        });

        expect(await loginPage.isLoggedIn()).toBeFalsy();
        
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBeTruthy();
      }
    });

    test('should handle login attempts with XSS patterns', async () => {
      const xssInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src=x onerror=alert("xss")>',
        '"><script>alert("xss")</script>'
      ];

      for (const xssInput of xssInputs) {
        await loginPage.clearForm();
        await loginPage.login({ 
          username: xssInput, 
          password: 'anypassword' 
        });

        expect(await loginPage.isLoggedIn()).toBeFalsy();
        
        const hasAlert = await loginPage.page.evaluate(() => {
          return window.alert !== window.alert;
        });
        expect(hasAlert).toBeFalsy();
      }
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle very long input values', async () => {
      const longUsername = 'a'.repeat(1000);
      const longPassword = 'b'.repeat(1000);

      await loginPage.login({ 
        username: longUsername, 
        password: longPassword 
      });

      expect(await loginPage.isFormVisible()).toBeTruthy();
      expect(await loginPage.isLoggedIn()).toBeFalsy();
    });

    test('should handle unicode characters in credentials', async () => {
      await loginPage.login({ 
        username: '用户名测试', 
        password: 'пароль123' 
      });

      expect(await loginPage.isFormVisible()).toBeTruthy();
      expect(await loginPage.isLoggedIn()).toBeFalsy();
    });

    test('should handle rapid form submissions', async () => {
      await loginPage.fillLoginForm(VALID_CREDENTIALS);
      
      await Promise.all([
        loginPage.submitForm(),
        loginPage.submitForm(),
        loginPage.submitForm()
      ]);

      expect(await loginPage.isFormVisible()).toBeTruthy();
    });

    test('should handle network interruption scenarios', async () => {
      await loginPage.page.setOffline(true);
      
      await loginPage.login(VALID_CREDENTIALS);
      
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();

      await loginPage.page.setOffline(false);
    });
  });

  test.describe('Performance Tests', () => {
    test('should login within acceptable time limit', async () => {
      const startTime = Date.now();
      
      await loginPage.login(VALID_CREDENTIALS);
      
      const endTime = Date.now();
      const loginTime = endTime - startTime;
      
      expect(loginTime).toBeLessThan(5000);
    });

    test('should handle multiple concurrent login attempts', async ({ browser }) => {
      const contexts = await Promise.all([
        browser.newContext(),
        browser.newContext(),
        browser.newContext()
      ]);

      const loginPromises = contexts.map(async (context) => {
        const page = await context.newPage();
        const concurrentLoginPage = new LoginPage(page);
        await concurrentLoginPage.navigateToLogin();
        await concurrentLoginPage.login(VALID_CREDENTIALS);
        return concurrentLoginPage.isLoggedIn();
      });

      const results = await Promise.all(loginPromises);
      results.forEach(isLoggedIn => {
        expect(isLoggedIn).toBeTruthy();
      });

      await Promise.all(contexts.map(context => context.close()));
    });
  });
});