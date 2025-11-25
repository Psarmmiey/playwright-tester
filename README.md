# Playwright Tester

A multi-project Playwright testing framework for automated browser testing.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

Initialize and install all dependencies:

```bash
# Clone the repository
npm install

# Install Playwright browsers
npx playwright install chromium
```

## Projects

### Project 1: ATC Portal Full-Page Screenshots

This project takes full-page screenshots of all pages accessible via buttons on the ATC Portal.

**Features:**
- Navigates to the ATC Portal URL
- Waits for `networkidle` before capturing
- Clicks all visible buttons on the page
- Takes full-page screenshots of each resulting page
- Saves screenshots to `project1/screenshots/` directory

**Target URL:** `https://solvente-ai-powered-charter-flight-management-358485273829.us-west1.run.app/#/atc-portal`

## Running Tests

### Project 1

```bash
# Run Project 1 tests
npm run test:project1

# Run Project 1 tests in headed mode (visible browser)
npm run test:project1:headed

# Run Project 1 tests in debug mode
npm run test:project1:debug
```

### Run All Tests

```bash
npm test
```

## NPM Commands Summary

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npx playwright install chromium` | Install Playwright Chromium browser |
| `npm run test:project1` | Run Project 1 tests |
| `npm run test:project1:headed` | Run Project 1 in headed mode |
| `npm run test:project1:debug` | Run Project 1 in debug mode |
| `npm test` | Run all tests |

## Project Structure

```
playwright-tester/
├── package.json
├── README.md
├── project1/
│   ├── playwright.config.ts
│   ├── tsconfig.json
│   ├── tests/
│   │   └── atc-portal-screenshots.spec.ts
│   └── screenshots/
└── ...
```

## Screenshots

Screenshots are saved to the `project1/screenshots/` directory and include:
- `initial-page.png` - Initial landing page
- `page-after-{button-name}-{index}.png` - Page after clicking each button