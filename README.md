# TAF — Test Automation Framework

A TypeScript-based end-to-end test automation framework built on [Playwright](https://playwright.dev/), targeting [Sauce Demo](https://www.saucedemo.com). It follows the **Page Object Model** pattern and ships with a custom fixture layer, structured logging, and a GitHub Actions CI pipeline.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [CI / GitHub Actions](#ci--github-actions)
- [Framework Overview](#framework-overview)
  - [Directory Structure](#directory-structure)
  - [Architecture](#architecture)
  - [Key Components](#key-components)
- [Test Suites](#test-suites)

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| Node.js | LTS (≥ 20) |
| npm | Bundled with Node |

No global Playwright installation is required — everything runs through the local `node_modules` binary.

---

## Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd TAF

# 2. Install dependencies
npm install

# 3. Install Playwright browser binaries
npx playwright install chromium --with-deps
```

---

## Environment Variables

All variables are optional. Defaults are safe for running against the public Sauce Demo site.

| Variable | Default | Description |
|---|---|---|
| `DEFAULT_TIMEOUT` | `30000` | Action/navigation timeout (ms) |
| `EXPECT_TIMEOUT` | `10000` | Assertion timeout (ms) |
| `CI` | _(unset)_ | When `true`, enables retries and blocks `test.only` |

Set variables inline or in a `.env` file (you will need a loader such as `dotenv` to auto-source it, or export them in your shell).

```bash
# Example: override base URL for a staging environment
BASE_URL=https://staging.example.com npm run test:e2e
```

---

## Running Tests

All scripts are defined in `package.json`.

```bash
# Run the full e2e suite (headless)
npm run test:e2e

# Run with a visible browser window
npm run test:e2e:headed

# Open Playwright's interactive UI mode
npm run test:e2e:ui

# Open the last HTML report in a browser
npm run report:e2e
```

### Running specific tests

```bash
# Run a single spec file
npx playwright test tests/e2e/home.spec.ts

# Run tests whose title matches a keyword
npx playwright test --grep "add backpack"

# Run the AI maintenance test suite
npx playwright test --config=ai.test.maintenance/playwright.config.ts
```

---

## CI / GitHub Actions

The pipeline is defined in [.github/workflows/playwright-tests.yml](.github/workflows/playwright-tests.yml) and runs on every **push** or **pull request** targeting `main`.

**Pipeline steps:**

1. Checkout source
2. Set up Node.js LTS with the Yarn cache
3. Install dependencies (`yarn install --immutable`)
4. Cache Playwright browser binaries (keyed on `yarn.lock`)
5. Install Chromium + system dependencies
6. Run the main e2e suite (`tests/e2e/`)
7. Move main artifacts, then run the AI maintenance suite (`ai.test.maintenance/tests/`)
8. Upload HTML reports and Playwright traces as artifacts for both suites

**Artifacts produced per run:**

| Artifact | Contents |
|---|---|
| `playwright-html-report-main` | Full HTML report for the main suite |
| `playwright-html-report-ai` | Full HTML report for the AI maintenance suite |
| `playwright-traces-main` | Trace ZIP files for failed main-suite tests |
| `playwright-traces-ai` | Trace ZIP files for failed AI-suite tests |

---

## Framework Overview

### Directory Structure

```
TAF/
├── src/
│   ├── components/          # Reusable UI component abstractions
│   │   ├── BaseComponent.ts
│   │   └── HeaderComponent.ts
│   ├── fixtures/
│   │   └── BaseTest.ts      # Custom Playwright fixture + shared hooks
│   ├── pages/               # Page Object Model classes
│   │   ├── BasePage.ts
│   │   ├── AuthPage.ts
│   │   ├── HomePage.ts
│   │   └── CheckoutPage.ts
│   └── utils/
│       ├── envHelper.ts     # Typed environment variable access
│       ├── logger.ts        # Structured console logger
│       └── priceHelper.ts   # Price parsing / formatting helpers
├── tests/
│   └── e2e/
│       └── home.spec.ts     # Main e2e test suite
├── ai.test.maintenance/     # AI-assisted test maintenance suite
│   ├── pages/
│   ├── tests/
│   └── playwright.config.ts
├── playwright.config.ts     # Root Playwright configuration
├── tsconfig.json
└── package.json
```

### Architecture

```
Test Spec
   │
   ▼
BaseTest (fixture)          ← injects page objects, registers beforeEach/afterEach
   │
   ├── AuthPage             ← extends BasePage
   ├── HomePage             ← extends BasePage
   ├── CheckoutPage         ← extends BasePage
   └── HeaderComponent      ← extends BaseComponent
         │
         ▼
      BasePage / BaseComponent   ← wraps Playwright Page locator API
         │
         ▼
      EnvHelper / Logger         ← cross-cutting utilities
```

### Key Components

#### `BasePage` / `BaseComponent`
Abstract base classes that wrap the Playwright `Page` API (`getByRole`, `getByLabel`, `getByTestId`, `locator`). All page objects and component objects extend these to gain a consistent locator interface without importing `Page` directly in test files.

#### `BaseTest` (fixture)
Extends Playwright's `test` with pre-built fixtures for every page object and component:

```typescript
import { test, expect } from '../../src/fixtures/BaseTest';

test('example', async ({ authPage, homePage, headerComponent }) => { ... });
```

`BaseTest.registerHooks()` also wires up shared `beforeEach`/`afterEach` logic:
- Clears cookies before every test
- Applies the configured default timeout
- Logs test start, finish, and failure to `Logger`

#### `EnvHelper`
Static helper that reads all runtime configuration from environment variables with safe defaults. Use it instead of hard-coding URLs, credentials, or timeouts.

#### `Logger`
Lightweight structured logger that prefixes every message with an ISO timestamp and severity level (`INFO`, `WARN`, `ERROR`). Used inside `BaseTest` hooks and available for use in page objects.

### Playwright Configuration Highlights

| Setting | Value |
|---|---|
| Browser | Chromium (Desktop Chrome) |
| Viewport | 1440 × 900 |
| Workers | 3 (parallel) |
| Retries | 2 in CI, 0 locally |
| Trace | `on-first-retry` |
| Screenshots | `only-on-failure` |
| Video | `retain-on-failure` |
| `testIdAttribute` | `data-test` |

---

## Test Suites

### Main suite — `tests/e2e/home.spec.ts`

| Test | Description |
|---|---|
| Login with standard user | Verifies successful login and inventory page load |
| Add backpack to cart | Adds an item and verifies the cart badge and cart page |
| Login with invalid password | Verifies the error message is shown |
| Sort by name Z to A | Verifies the `za` sort option is applied |
| Sort by price low to high | Verifies prices are sorted in ascending order |
| Sort by price high to low | Verifies prices are sorted in descending order |

### AI maintenance suite — `ai.test.maintenance/`

A secondary suite used for AI-assisted test analysis, refactoring experiments, and documentation generation. It has its own `playwright.config.ts` and is run independently in CI.
