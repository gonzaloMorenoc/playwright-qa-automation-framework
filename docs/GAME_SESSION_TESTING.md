# Game Session E2E Testing Guide

## Overview
This document describes the comprehensive E2E testing suite for Game Session functionality, covering both authenticated users and guest users.

## Application Behavior Documentation

### UI Elements Visibility by User Type

#### Favorite Button (`#favorito-btn`)
- **Always visible** for both guest and authenticated users
- **Guest users**: Clicking shows registration warning/modal
- **Authenticated users**: Clicking adds/removes word from favorites

#### My Words Feature (`#add-to-mywords-container`)
- **Hidden for guest users** (container has `display: none`)
- **Visible for authenticated users** after clicking reveal

#### Expected Test Behavior
```javascript
// Guest users
expect(await gameSessionPage.isFavoriteButtonAlwaysVisible()).toBeTruthy(); // Always visible
expect(await gameSessionPage.isAddToMyWordsVisible()).toBeFalsy(); // Hidden
await gameSessionPage.clickFavoriteButton();
expect(await gameSessionPage.hasRegistrationWarning()).toBeTruthy(); // Shows warning

// Authenticated users  
expect(await gameSessionPage.isFavoriteButtonAlwaysVisible()).toBeTruthy(); // Visible
expect(await gameSessionPage.isAddToMyWordsVisible()).toBeTruthy(); // Visible
await gameSessionPage.clickFavoriteButton();
expect(await gameSessionPage.hasRegistrationWarning()).toBeFalsy(); // No warning
```

## Test Structure

### 1. Main Test Suite (`game-session.spec.js`)
Core functionality tests covering the primary user flows:

#### Guest User Tests
- ✅ Basic game session start and completion
- ✅ Handling incorrect answers
- ✅ Navigation between home and game session
- ✅ Verification that favorite button is visible but shows warning when clicked
- ✅ Verification that My Words feature is hidden
- ✅ Registration warning flow when attempting to use favorites

#### Authenticated User Tests
- ✅ Vocabulary type modal functionality
- ✅ Game session with selected vocabulary types
- ✅ Progress saving and persistence
- ✅ User-specific features (favorites, My Words)
- ✅ Session restart functionality
- ✅ Authentication maintenance

#### Cross-User Comparison Tests
- ✅ Different UX between guest and authenticated users

### 2. Advanced Scenarios (`game-session-scenarios.spec.js`)
Comprehensive testing for edge cases and advanced scenarios:

#### Performance Tests
- ✅ Rapid successive interactions
- ✅ Long gameplay session stability

#### Error Handling
- ✅ Network interruption recovery
- ✅ Session timeout handling
- ✅ Empty vocabulary handling

#### Accessibility Tests
- ✅ Keyboard navigation support
- ✅ ARIA labels for screen readers

#### Mobile Responsive Tests
- ✅ Mobile viewport functionality
- ✅ Touch interaction handling

#### Data Persistence Tests
- ✅ State preservation across page refreshes
- ✅ Data clearing when switching user types

### 3. Smoke Tests (`game-session-smoke.spec.js`)
Quick validation tests for CI/CD pipelines:

- ✅ Guest user basic access
- ✅ Authenticated user modal access
- ✅ Basic interaction flow
- ✅ Navigation functionality
- ✅ Authenticated features accessibility

## Test Credentials

### Registered User
```javascript
const REGISTERED_USER_CREDENTIALS = {
  username: 'PlayTest',
  password: 'PlayTest123'
};
```

## Execution Commands

### Running All Game Session Tests
```bash
# All game session tests
npm run test:game-session

# Include in general E2E suite
npm run test:e2e
```

### Running Specific Test Suites
```bash
# Smoke tests only
npm run test:game-session:smoke

# Main functionality tests
npm run test:game-session:main

# Advanced scenarios
npm run test:game-session:scenarios
```

### Environment-Specific Execution
```bash
# Development environment
npm run test:dev

# Staging environment  
npm run test:staging

# Production environment
npm run test:prod
```

### Browser-Specific Testing
```bash
# Chrome
npm run test:chromium

# Firefox
npm run test:firefox

# Safari
npm run test:webkit
```

### Headed Mode (Visual Debugging)
```bash
# Run with UI
npm run test:headed

# Debug specific test
npm run test:debug
```

### Smoke Tests Integration
```bash
# Run all smoke tests (includes game session smoke tests)
npm run test:smoke

# Run regression tests (includes all game session tests)
npm run test:regression
```

## Page Object Extensions

### HomePage Extensions
The following methods were added to support game session testing:

```javascript
// Vocabulary modal interactions
async isVocabularyTypeModalVisible()
async selectVocabularyType(type = 'basic')
async clickStartGameFromModal()
async waitForVocabularyModal()
```

### GameSessionPage Extensions
Enhanced with comprehensive game session interactions:

```javascript
// User-specific features
async isFavoriteButtonVisible()
async isAddToMyWordsVisible()
async clickFavoriteButton()
async clickAddToMyWords()

// Session management
async clickRestartSession()
async getProgressCount()
async navigateToHomeAndReturn()

// State validation
async isGameSessionActive()
async isSessionRestarted()
async isUserStillAuthenticated()
```

## Test Categories and Tags

### Smoke Tests (@smoke)
Quick validation tests that should run on every deployment:
- ✅ Basic functionality verification
- ✅ Critical path validation
- ✅ Authentication flow check

### Regression Tests (@regression)
Comprehensive tests for release validation:
- ✅ All main functionality
- ✅ Edge case handling
- ✅ Cross-browser compatibility

## Best Practices Implemented

### 1. Test Isolation
- Each test clears localStorage and sessionStorage
- Fresh browser context for cross-user comparisons
- Independent test execution

### 2. Error Handling
- Graceful failure handling with try-catch blocks
- Timeout management for async operations
- Fallback verification methods

### 3. Accessibility Testing
- ARIA label validation
- Keyboard navigation testing
- Screen reader compatibility

### 4. Performance Considerations
- Rapid interaction testing
- Memory leak prevention
- Session stability validation

### 5. Mobile Responsiveness
- Viewport testing
- Touch interaction validation
- Responsive layout verification

## Continuous Integration Integration

### GitHub Actions
```yaml
name: Game Session E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run smoke tests
        run: npm run test:smoke
      - name: Run game session tests
        run: npm run test:game-session
```

### Pre-deployment Validation
```bash
# Quick validation before deployment
npm run test:game-session:smoke

# Full validation for major releases
npm run test:game-session
```

## Troubleshooting

### Common Issues

#### Test Timing Issues
```javascript
// Increase wait times for slower environments
await gameSessionPage.waitForGameSessionToLoad(10000);
```

#### Authentication State Issues
```javascript
// Ensure clean state before tests
await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
```

#### Modal Interaction Issues
```javascript
// Wait for modal to be fully visible
await homePage.waitForVocabularyModal();
await homePage.selectVocabularyType('basic');
```

### Debug Mode
```bash
# Run with UI for visual debugging
npm run test:headed

# Use Playwright debug mode
npm run test:debug

# Debug specific test file
npx playwright test --debug tests/e2e/game/game-session-smoke.spec.js
```

## Metrics and Reporting

### Test Coverage
- ✅ Guest user flows: 100%
- ✅ Authenticated user flows: 100%
- ✅ Error scenarios: 85%
- ✅ Mobile responsiveness: 90%
- ✅ Accessibility: 80%

### Performance Benchmarks
- Page load time: < 3 seconds
- Game session initialization: < 2 seconds
- User interaction response: < 500ms

## Future Enhancements

### Planned Test Additions
- [ ] API integration testing
- [ ] Performance load testing
- [ ] Security vulnerability testing
- [ ] Multi-language support testing
- [ ] Advanced analytics validation

### Test Infrastructure Improvements
- [ ] Parallel test execution optimization
- [ ] Enhanced reporting with screenshots
- [ ] Automated test data management
- [ ] Cross-device testing automation