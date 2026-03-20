# Legacy Test Analysis — `main.navigation.spec.ts`

**File reviewed:** `ai.test.maintenance/tests/main.navigation.spec.ts`  
**Date:** 2026-03-20  
**Scope:** Visibility, navigation, selector quality, synchronization, accessibility, coverage, readability/reuse, duplication risks.

---

## Prioritized Issues

### P1 — Flakiness Risks (fix first)

| # | Location | Issue | Category |
|---|---|---|---|
| 1 | Lines 17, 28 | `await page.waitForTimeout(2000)` — fixed 2-second sleeps instead of waiting for a condition. Makes the suite slow and still fails under load or slow networks. | Synchronization |
| 2 | Line 17 | `page.locator('a.navbar__link:has-text("Docs")')` — CSS class selector. Docusaurus class names are build-generated and can change on any version bump. | Selector quality |

---

### P2 — Selector Inconsistency / Maintenance Cost

| # | Location | Issue | Category |
|---|---|---|---|
| 3 | Lines 17–19 | Mixed selector strategy: `Docs` uses a raw CSS class locator while `API` and `Community` use the POM's role-based `navLink()`. The same element is queried two different ways, creating drift risk if the POM changes. | Selector quality / Reuse |
| 4 | Lines 17–19 | The first test bypasses the POM entirely for `Docs` — the POM's `navLink()` is not used, breaking the encapsulation contract. | Readability / Reuse |

---

### P3 — Coverage Gaps

| # | Issue | Category |
|---|---|---|
| 5 | After clicking a nav link, only `toHaveURL()` is asserted. There is no assertion that the destination page loaded meaningful content (e.g., a heading or landmark). A redirect or blank page at the correct URL would pass. | Coverage |
| 6 | No check that the links carry the correct `href` attributes without navigating. A broken `href="#"` that happens to redirect would still pass the URL check. | Coverage |
| 7 | No verification that the links are keyboard-accessible (reachable via Tab / focusable). All three should be native `<a>` elements, but this is never verified explicitly. | Accessibility |

---

### P4 — Readability / Duplication Risks

| # | Issue | Category |
|---|---|---|
| 8 | The `navLinks` array duplicates knowledge of the site's routing. If the site restructures URLs, the array silently diverges — there is no canonical source of truth linking link text to its target. | Duplication / Maintenance |
| 9 | `await homePage.goto()` is repeated in every test (4 times). A `test.beforeEach` hook would reduce duplication and make setup changes a single-point edit. | Readability / Reuse |
| 10 | The data-driven `for...of` loop generates test names at parse time but keeps the display name and URL in an untyped plain object. A TypeScript interface would catch mismatches at compile time. | Readability / Maintainability |

---

## Additional Issues an AI Might Miss

| # | Issue | Why it's easy to overlook |
|---|---|---|
| A | The `Community` link navigates to `/community/welcome`, but the rendered heading on that page may differ. Without a heading assertion, a redirected or wrong page at the right URL is invisible. | URL checks feel complete but aren't. |
| B | `waitForTimeout` was likely added because navigation completed before auto-waiting resolved. This is a signal that the POM's `goto()` may not wait for a stable, interactive state. The timeout treats a symptom, not the cause. | Easy to leave "because it works." |
| C | Visibility checks pass even if links are present in the DOM but hidden (e.g., inside a collapsed mobile menu). `toBeVisible()` checks CSS visibility, but the 1440 px viewport makes this pass today — any responsive change would silently break it without a dedicated layout test. | Passes today, fragile long-term. |

---

## Recommended Fix Checklist (for next refactor)

- [ ] **P1** Remove both `waitForTimeout` calls; replace with auto-retrying assertions or URL/heading checks
- [ ] **P1** Replace `a.navbar__link:has-text("Docs")` with `homePage.navLink('Docs')` (role-based)
- [ ] **P2** Use `navLink()` consistently for all three links in the visibility test
- [ ] **P3** Add a landmark/heading assertion after each navigation (e.g., `toBeVisible()` on the page `<h1>`)
- [ ] **P3** Optionally assert `href` attribute values before clicking to validate link targets without navigation
- [ ] **P4** Extract `await homePage.goto()` into a `test.beforeEach` block
- [ ] **P4** Add a TypeScript interface for `navLinks` entries to catch mismatches at compile time
- [ ] **[A]** Add at least one destination-content assertion per nav link
- [ ] **[B]** Investigate why `waitForTimeout` was needed and fix the root cause in `goto()` or test setup


1. check href before clicking
2. area-current="page"