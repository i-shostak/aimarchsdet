# Suite Maintenance Summary

**Reviewed:** `ai.test.maintenance/tests/` (7 spec files)  
**Date:** 2026-03-20

---

## File-by-File Findings

### `get-started.legacy.spec.ts` — DELETE

| Issue | Detail |
|-------|--------|
| Broken URLs | All 4 navigation tests target `/docs/getting-started`, which 404s or redirects since 2024-Q2 |
| Broken heading assertion | `'Getting Started'` — renamed to `'Installation'` in Docusaurus v3 |
| Broken title assertion | `'Getting Started \| Playwright'` — title now reads `'Installation \| Playwright'` |
| Broken selector | `.menu__link:has-text("Writing Tests")` — section was split; node no longer exists |
| Redundant test | "Get Started link exists" duplicates `playwright-docs.spec.ts` → "get started link navigates to installation page" |
| Anti-pattern | `waitForTimeout()` used in every test — masks real flakiness |

**Recommended action:** Delete entirely. No salvageable unique coverage.

---

### `home.legacy.spec.ts` — DELETE

| Issue | Detail |
|-------|--------|
| Hardcoded base URL | `const BASE_URL = 'https://playwright.dev'` — ignores `playwright.config.ts` `baseURL` setting |
| Stale title assertion | `'Fast and reliable…'` title changed in 2024 redesign |
| Broken selector | `.hero__subtitle` — pre-Docusaurus v3 class; no longer in DOM |
| Broken nav assertion | `a.navbar__link:has-text("Blog")` — `Blog` removed from primary navbar in 2024 |
| Hardcoded year | `'Copyright © 2023 Microsoft'` — fails every year after 2023 |
| Redundant test | "Get Started button exists" duplicates `playwright-docs.spec.ts` |
| Anti-pattern | `waitForTimeout()` used in every test |

**Recommended action:** Delete entirely. All broken; no unique coverage.

---

### `navigation.duplicate.spec.ts` — DELETE

| Issue | Detail |
|-------|--------|
| Fully redundant | File header explicitly declares it as a duplicate of both `main.navigation.refactored.spec.ts` and `main.navigation.professional.spec.ts` |
| Fragile selectors | Uses raw CSS attribute selectors (`nav a[href]:has-text(...)`, `a.navbar__link:has-text(...)`) instead of role-based locators |
| Anti-pattern | `waitForTimeout()` in all navigation tests |

**Recommended action:** Delete entirely. Coverage is a strict subset of `main.navigation.professional.spec.ts`.

---

### `main.navigation.spec.ts` — DELETE

| Issue | Detail |
|-------|--------|
| Superseded | Coverage is a strict subset of `main.navigation.refactored.spec.ts` |
| Mixed selector strategies | One test uses raw CSS `a.navbar__link:has-text("Docs")` while others use the page object |
| No heading assertions | Landing-page content is not verified after navigation |
| No aria-current assertions | Active nav state is not checked |
| Anti-pattern | `waitForTimeout(2000)` in every test |

**Recommended action:** Delete. Use `main.navigation.professional.spec.ts` as the canonical spec.

---

### `main.navigation.refactored.spec.ts` — KEEP (with applied fixes)

| Issue | Fix Applied |
|-------|-------------|
| Duplicate `NavLink` interface | Removed; now imports `NavLink` from `main.navigation.professional.spec.ts` |
| Exact URL match | Replaced `toHaveURL(url)` with `toHaveURL(urlRegex(url))` — tolerates trailing slashes |
| Inline `aria-current` attribute check | Replaced with `homePage.assertNavLinkActive()` — uses the page-object method |
| No sibling-inactive assertion | Added `assertNavLinkInactive()` loop for all sibling links |
| Redundant inline heading locator | Replaced `page.getByRole('heading', …).toBeVisible()` with `homePage.assertDestinationHeading()` |

---

### `main.navigation.professional.spec.ts` — KEEP (canonical)

No issues found. This is the gold-standard navigation spec:
- TC-IDs documented (`TC-NAV-001` through `TC-NAV-006`)
- Positive, negative, and edge-case coverage
- `urlRegex()` tolerates trailing slashes
- ARIA active/inactive sibling assertions
- Disallowed-link regression guard (`Blog`, `Pricing`, `Login`)
- Href security check (rejects `#`, empty, `javascript:` URIs)

---

### `playwright-docs.spec.ts` — KEEP (no changes)

Clean, minimal smoke suite. Uses the page object; no issues.

---

## Consolidation Plan

```
BEFORE (7 files, ~28 tests)           AFTER (3 files, ~15 tests)
────────────────────────────────────  ──────────────────────────────────────
get-started.legacy.spec.ts     ──►  DELETE
home.legacy.spec.ts            ──►  DELETE
navigation.duplicate.spec.ts   ──►  DELETE
main.navigation.spec.ts        ──►  DELETE
                                     ┌──────────────────────────────────────┐
main.navigation.refactored.spec.ts ► │ main.navigation.refactored.spec.ts   │ (fixed)
main.navigation.professional.spec.ts │ main.navigation.professional.spec.ts │ (canonical)
playwright-docs.spec.ts        ──►  │ playwright-docs.spec.ts               │
                                     └──────────────────────────────────────┘
```

**Deletion order** (safe — no remaining file imports from these):
1. `get-started.legacy.spec.ts`
2. `home.legacy.spec.ts`
3. `navigation.duplicate.spec.ts`
4. `main.navigation.spec.ts`

> **Note:** `main.navigation.refactored.spec.ts` may itself be deleted once teams are comfortable relying solely on `main.navigation.professional.spec.ts`, which provides a strict superset of its coverage.

---

## Representative Diff — `main.navigation.refactored.spec.ts`

The following changes were applied to this file:

```diff
--- a/ai.test.maintenance/tests/main.navigation.refactored.spec.ts
+++ b/ai.test.maintenance/tests/main.navigation.refactored.spec.ts
@@ -1,11 +1,14 @@
 import { test, expect } from '@playwright/test';
 
 import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';
+import type { NavLink } from './main.navigation.professional.spec';
 
-interface NavLink {
-  name: string;
-  url: string;
-  heading: string;
-}
+/** Matches a URL path with or without a trailing slash. */
+function urlRegex(path: string): RegExp {
+  return new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\/?$');
+}
 
 const navLinks: NavLink[] = [
@@ -28,17 +31,18 @@
   for (const { name, url, heading } of navLinks) {
     test(`${name} link opens the correct page`, async ({ page }) => {
-      // Verify link target before clicking
       await homePage.assertNavLink(name, url);
-
       await homePage.clickNavLink(name);
 
-      // Verify URL and destination page content loaded
-      await expect(page).toHaveURL(url);
-      await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
+      // URL tolerance: accept with or without trailing slash
+      await expect(page).toHaveURL(urlRegex(url));
+      await homePage.assertDestinationHeading(heading);
 
-      // Verify active nav state is reflected accessibly
-      await expect(homePage.navLink(name)).toHaveAttribute('aria-current', 'page');
+      // Active link must carry aria-current="page"
+      await homePage.assertNavLinkActive(name);
+
+      // All sibling links must be inactive
+      for (const { name: sibling } of navLinks.filter(l => l.name !== name)) {
+        await homePage.assertNavLinkInactive(sibling);
+      }
     });
   }
 });
```

---

## Summary

| Metric | Before | After |
|--------|--------|-------|
| Spec files | 7 | 3 |
| Total tests | ~28 | ~15 |
| Broken selectors | 8 | 0 |
| `waitForTimeout()` uses | 18 | 0 |
| Hardcoded base URLs | 1 | 0 |
| Duplicate test scenarios | ~12 | 0 |
| Hardcoded assertion years | 1 | 0 |
