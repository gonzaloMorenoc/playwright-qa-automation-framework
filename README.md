# Playwright Automation - OrangeHRM

Automated testing project for the OrangeHRM demo application using Playwright and the Page Object Model pattern.

## What's included

- Page Object Model architecture for maintainable tests
- Multi-environment support (production/preproduction) 
- Cross-browser testing (Chrome, Firefox, Safari)
- GitHub Actions CI/CD pipeline
- HTML, JSON, and JUnit reporting
- Custom test fixtures and utilities

## Getting started

**Prerequisites:** Node.js 16+ and npm

```bash
# Clone and install
git clone <repository-url>
cd playwright-automation-project
npm install

# Install browsers
npx playwright install
```

## Project structure

```
src/
├── pages/           # Page Object Models
├── utils/           # Configuration and test data
└── fixtures/        # Test setup helpers
tests/               # Test specifications
.github/workflows/   # CI/CD configuration
```

## Running tests

```bash
# Basic commands
npm test                    # Run all tests
npm run test:headed         # Run with browser UI
npm run test:debug          # Debug mode
npm run report             # View test results

# Environment specific
npm run test:production     # Production environment
npm run test:preproduction  # Preproduction environment

# Test specific areas
npm run test:login:production
```

## Configuration

The project uses environment files for different setups:

**Production** (`.env.production`):
- URL: https://opensource-demo.orangehrmlive.com
- Credentials: Admin/admin123

**Preproduction** (`.env.preproduction`):
- Configure your own environment settings

## How it works

### Page Objects
Each page has its own class with methods for interacting with elements. For example, `LoginPage.js` handles all login-related actions.

### Test Data
Centralized in `src/utils/testData.js` - all test credentials, URLs, and expected messages are defined here.

### Fixtures
Custom setup in `src/fixtures/testFixtures.js`:
- `loginPage` - automatically navigates to login
- `authenticatedPage` - logs in and provides authenticated state

### CI/CD
GitHub Actions runs tests on every push and pull request, plus daily scheduled runs. Results are published to GitHub Pages.

## Reports

Three types of reports are generated:
- **HTML**: Visual results with screenshots and videos
- **JSON**: Machine-readable data
- **JUnit**: For CI/CD integration

The project follows standard Playwright patterns with clean separation between page logic and test logic.