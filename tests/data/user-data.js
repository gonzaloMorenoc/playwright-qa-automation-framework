/**
 * Test data for user registration and authentication tests
 */

const generateUniqueId = () => Date.now() + Math.floor(Math.random() * 1000);

const validPasswords = [
  'Password123!',
  'MySecure123',
  'TestPass456',
  'ValidPassword1',
  'StrongP@ss123'
];

const invalidPasswords = [
  { password: '123456', expectedError: 'Password must have at least 8 chars, 1 uppercase, 1 lowercase, and 1 digit.' },
  { password: 'password', expectedError: 'uppercase' },
  { password: 'PASSWORD123', expectedError: 'lowercase' },
  { password: 'Pass123', expectedError: 'Password must have at least 8 chars, 1 uppercase, 1 lowercase, and 1 digit.' },
  { password: 'NoNumbers', expectedError: 'digit' },
  { password: 'nonumber', expectedError: 'uppercase' },
  { password: '12345678', expectedError: 'uppercase' },
  { password: 'ALLUPPERCASE', expectedError: 'digit' }
];

const invalidEmails = [
  { email: 'invalid-email', expectedValidation: '@' },
  { email: 'test@', expectedValidation: 'domain' },
  { email: '@domain.com', expectedValidation: 'username' },
  { email: 'test.domain.com', expectedValidation: '@' },
  { email: '', expectedValidation: 'required' }
];

const UserDataFactory = {
  /**
   * Generate a valid user for registration
   */
  createValidUser: (overrides = {}) => {
    const uniqueId = generateUniqueId();
    return {
      username: `testuser${uniqueId}`,
      email: `test${uniqueId}@example.com`,
      name: 'John',
      lastname: 'Doe',
      photo: 'https://example.com/photo.jpg',
      password: validPasswords[Math.floor(Math.random() * validPasswords.length)],
      ...overrides
    };
  },

  /**
   * Generate a minimal valid user (only required fields)
   */
  createMinimalUser: (overrides = {}) => {
    const uniqueId = generateUniqueId();
    return {
      username: `minimal${uniqueId}`,
      email: `minimal${uniqueId}@example.com`,
      name: 'Min',
      lastname: 'User',
      password: 'MinPass123!',
      ...overrides
    };
  },

  /**
   * Generate valid login credentials for existing user
   */
  createValidLoginCredentials: (overrides = {}) => {
    return {
      username: 'PlayTest',
      password: 'PlayTest123',
      ...overrides
    };
  },

  /**
   * Generate invalid login credentials for testing
   */
  createInvalidLoginCredentials: (type, overrides = {}) => {
    const baseInvalid = {
      username: 'invaliduser',
      password: 'wrongpassword',
      ...overrides
    };

    switch (type) {
      case 'empty':
        return { username: '', password: '' };
      
      case 'emptyUsername':
        return { username: '', password: 'PlayTest123' };
      
      case 'emptyPassword':
        return { username: 'PlayTest', password: '' };
      
      case 'wrongPassword':
        return { username: 'PlayTest', password: 'wrongpassword' };
      
      case 'wrongUsername':
        return { username: 'wronguser', password: 'PlayTest123' };
      
      case 'nonexistent':
        return { username: 'nonexistentuser', password: 'nonexistentpass' };
        
      case 'caseIncorrect':
        return { username: 'playtest', password: 'playtest123' };
        
      default:
        return baseInvalid;
    }
  },

  /**
   * Generate credentials with special characters for security testing
   */
  createSecurityTestCredentials: (type, overrides = {}) => {
    switch (type) {
      case 'sql_injection':
        return {
          username: "' OR '1'='1",
          password: "'; DROP TABLE users; --",
          ...overrides
        };
      
      case 'xss':
        return {
          username: '<script>alert("xss")</script>',
          password: 'javascript:alert("xss")',
          ...overrides
        };
      
      case 'unicode':
        return {
          username: '用户名测试',
          password: 'пароль123',
          ...overrides
        };
        
      default:
        return {
          username: 'securitytest',
          password: 'security123',
          ...overrides
        };
    }
  },

  /**
   * Generate user with invalid password
   */
  createUserWithInvalidPassword: (invalidPasswordData, overrides = {}) => {
    const uniqueId = generateUniqueId();
    return {
      username: `invalid${uniqueId}`,
      email: `invalid${uniqueId}@example.com`,
      name: 'Invalid',
      lastname: 'Password',
      password: invalidPasswordData.password,
      expectedError: invalidPasswordData.expectedError,
      ...overrides
    };
  },

  /**
   * Generate user with invalid email
   */
  createUserWithInvalidEmail: (invalidEmailData, overrides = {}) => {
    const uniqueId = generateUniqueId();
    return {
      username: `invalidemail${uniqueId}`,
      email: invalidEmailData.email,
      name: 'Invalid',
      lastname: 'Email',
      password: 'Password123!',
      expectedValidation: invalidEmailData.expectedValidation,
      ...overrides
    };
  },

  /**
   * Generate user with missing required field
   */
  createUserWithMissingField: (missingField, overrides = {}) => {
    const uniqueId = generateUniqueId();
    const userData = {
      username: `missing${uniqueId}`,
      email: `missing${uniqueId}@example.com`,
      name: 'Missing',
      lastname: 'Field',
      password: 'Password123!',
      ...overrides
    };

    // Remove the specified field
    delete userData[missingField];
    return userData;
  },

  /**
   * Generate user for boundary testing
   */
  createBoundaryTestUser: (type, overrides = {}) => {
    const uniqueId = generateUniqueId();
    const baseUser = {
      username: `boundary${uniqueId}`,
      email: `boundary${uniqueId}@example.com`,
      name: 'Boundary',
      lastname: 'Test',
      password: 'Password123!'
    };

    switch (type) {
      case 'maxLength':
        return {
          ...baseUser,
          username: 'a'.repeat(50),
          name: 'A'.repeat(100),
          lastname: 'B'.repeat(100),
          photo: 'https://example.com/' + 'c'.repeat(200) + '.jpg',
          ...overrides
        };
      
      case 'specialChars':
        return {
          ...baseUser,
          username: `test${uniqueId}`, // Remove special chars from username
          name: 'Test@#$',
          lastname: 'User!@#',
          password: 'Password123!@#$',
          ...overrides
        };
      
      case 'unicode':
        return {
          ...baseUser,
          name: 'José',
          lastname: 'García',
          username: `unicode${uniqueId}`,
          ...overrides
        };
      
      default:
        return baseUser;
    }
  }
};

// Export everything
module.exports = {
  UserDataFactory,
  validPasswords,
  invalidPasswords,
  invalidEmails,
  
  // Common test data
  commonTestData: {
    validPhotoUrls: [
      'https://example.com/photo.jpg',
      'https://test.com/image.png',
      'https://api.example.com/avatar.gif'
    ],
    
    specialCharacterSets: [
      '!@#$%^&*()',
      'áéíóúñü',
      '中文测试',
      'עברית',
      'العربية'
    ],
    
    longStrings: {
      short: 'a'.repeat(10),
      medium: 'b'.repeat(50),
      long: 'c'.repeat(100),
      veryLong: 'd'.repeat(500)
    }
  }
};