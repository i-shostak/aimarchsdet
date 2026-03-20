# Review: `main.navigation.refactored.spec.ts`

**Date:** 2026-03-20  
**Reviewer:** AI Code Review  
**File reviewed:** `ai.test.maintenance/tests/main.navigation.refactored.spec.ts`  
**POM reviewed:** `ai.test.maintenance/pages/PlaywrightHomePage.ts`  
**Checklist axes:** Traceability · Coverage · Maintainability · Clarity · Validation Quality · Accessibility/Compliance

---

## Numbered Findings

### Traceability

**1. No test IDs or requirement/ticket references**  
The file contains no link to acceptance criteria, user stories, or issue trackers. Every `test(...)` call has only a human-readable display name.  
- Affects: entire file — `test.describe` (line 19), all `test(...)` calls (lines 26, 33)  
- Risk: impossible to trace a failing test back to the controlling requirement; coverage gaps are invisible to project management tooling.

---

### Coverage — Positive

**2. Heading values are undocumented hard-coded strings**  
`'Installation'`, `'Playwright Library'`, and `'Welcome'` (lines 13–15) come from the live site; their provenance is unexplained. If the site renames an `<h1>`, the test breaks with no obvious fix path.  
- Affects: `navLinks` array, lines 13–15  
- Risk: silent staleness; next refactor may silently change a heading to the wrong value.

**3. `toHaveURL` uses an exact relative-path string — trailing-slash / redirect fragility**  
`await expect(page).toHaveURL(url)` (line 40) performs an exact string match. Playwright resolves the relative path against `baseURL`, giving `https://playwright.dev/docs/intro`. If the site returns a trailing slash (`/docs/intro/`) or a canonical redirect, the assertion fails spuriously.  
- Affects: line 40  
- Risk: intermittent false failures after Docusaurus upgrades.

---

### Coverage — Negative

**4. Zero negative / error-path tests**  
No test verifies what happens when a nav item is absent, disabled, or renders with a broken `href="#"`. If a link is accidentally removed from the DOM the suite still skips it cleanly rather than failing loudly. The `for...of` loop (line 32) only iterates over the *expected* links; it cannot detect an unexpected absence unless `navLink()` throws.  
- Affects: entire test suite  
- Risk: a deleted nav link goes undetected until a user reports it.

---

### Coverage — Edge

**5. No keyboard-navigation (Tab/Enter) test**  
WCAG 2.1 SC 2.1.1 (Keyboard) requires all functionality to be operable via keyboard alone. No test verifies that nav links are reachable by Tab or activatable by Enter/Space.  
- Affects: entire test suite  
- Risk: keyboard regression is invisible; fails WCAG compliance audit.

**6. No responsive / collapsed-nav test**  
At narrow viewports the Docusaurus navbar collapses into a hamburger menu. All tests run at `Desktop Chrome` viewport (from config); no test checks link accessibility at a mobile breakpoint.  
- Affects: `playwright.config.ts` — `projects` array (single `chromium` project); no mobile project defined  
- Risk: mobile nav regression is invisible.

**7. No network / loading-state edge case**  
No test exercises slow network or offline conditions. Navigation assertions could pass before meaningful content is interactive.  
- Affects: entire navigation test set  
- Risk: low priority for E2E, but worth noting for CI environments with throttled networks.

---

### Maintainability

**8. Redundant `assertNavLink` call inside each per-link test**  
`homePage.assertNavLink(name, url)` is called in the first test (line 29, iterating all three links) *and* again inside every per-link test at line 36 ("Verify link target before clicking"). This means each link's visibility + href attributes are asserted **twice** per full test run.  
- Affects: line 36 inside the `for...of` block (lines 32–44)  
- Decision needed: if line 36 is intentional as a pre-condition guard, add a comment explicitly saying so and consider whether the first standalone test is then redundant; if it is defensive boilerplate, remove one of the two.

**9. POM `assertNavLink` creates the same locator twice**  
In `PlaywrightHomePage.ts` (lines 29–30), `assertNavLink` calls `this.navLink(name)` twice in sequence, constructing two separate `Locator` objects for the same element. This is a minor inefficiency but also a readability signal — a single `const link = this.navLink(name)` would clarify intent.  
- Affects: `pages/PlaywrightHomePage.ts`, lines 29–30

**10. `navLinks` data is test-only; no shared constant with the page-object or config**  
The `navLinks` array (lines 11–16) duplicates routing knowledge that could live in the POM or a shared constants file. If a URL changes, both the POM's locators and this array must be updated separately.  
- Affects: lines 11–16  
- Risk: low today (small array), but a pattern that scales poorly.

---

### Clarity

**11. `test.describe` name is generic**  
`'Main page navigation'` (line 19) does not identify the target site or the scope (e.g., it could apply to any site). A name like `'playwright.dev — primary navbar'` would make HTML reports and CI logs self-explanatory without opening the file.  
- Affects: line 19

**12. Comment "Verify active nav state is reflected accessibly" is implementation-specific and unexplained**  
The comment at line 41 is good intent, but `aria-current="page"` is a Docusaurus/SPA-specific behaviour — not universally guaranteed after navigation. The comment should note that this is site-specific and link to (or reference) the relevant ARIA spec or Docusaurus behaviour.  
- Affects: comment on line 41

**13. The `NavLink` interface is defined but not exported or reused**  
`interface NavLink` (lines 7–11) is local to the test file. If heading-aware link data is ever needed in another spec or in the POM, this type must be redefined or the interface moved.  
- Affects: lines 7–11

---

### Validation Quality

**14. `toHaveURL` assertion (line 40) provides weaker signal than a regex**  
An exact string like `'/docs/intro'` gives no tolerance for minor URL variations. A regex such as `/\/docs\/intro\/?$/` would accept both with and without trailing slash and make the test's intent explicit without being overly broad.  
- Affects: line 40

**15. Heading assertion does not guard against partial-text matches**  
`page.getByRole('heading', { name: heading, level: 1 })` (line 41) uses Playwright's default `exact: false` behaviour. So `heading: 'Installation'` would also match a heading `'Installation Guide'`. Using `{ name: heading, exact: true, level: 1 }` makes the assertion stricter.  
- Affects: line 41

**16. No assertion for the page `<title>` element**  
After navigation, only the `<h1>` and URL are checked. The `<title>` tag is the primary accessibility descriptor for browser tabs and screen readers. Its absence from the assertion set is a minor but real gap.  
- Affects: per-link tests (lines 38–43)

---

### Accessibility / Compliance

**17. `aria-current` checked only post-navigation; not checked that it is absent on non-active links**  
Line 42 confirms `aria-current="page"` is set on the link that was clicked. It does not confirm that the same attribute is *absent* (or `false`) on the other two links, which would be needed to satisfy ARIA Authoring Practices (only one landmark item should carry `aria-current="page"` at a time).  
- Affects: line 42

**18. No test for link `role` conformance beyond implicit assumption**  
The POM uses `getByRole('link', { name })` which implicitly validates that the element is an `<a>` (or has `role="link"`). This is good. However, no explicit assertion confirms the link is focusable (`tabIndex` not `-1`) or has a non-empty accessible name independent of its text content (WCAG 4.1.2).  
- Affects: `PlaywrightHomePage.ts` navLink usage throughout

---

## Prioritized Fix Plan

| Priority | Finding # | What to fix | Effort |
|----------|-----------|-------------|--------|
| **P1** | 3, 14 | Replace exact URL string with `/\/docs\/intro\/?$/`-style regex in `toHaveURL` to eliminate trailing-slash fragility | Low (2 min) |
| **P1** | 15 | Add `exact: true` to every `getByRole('heading', ...)` call | Low (2 min) |
| **P1** | 8 | Decide: remove redundant `assertNavLink` (line 36) if the standalone display test covers it, or add a comment making the guard intent explicit | Low (5 min) |
| **P2** | 1 | Add a `test.info().annotations` tag or `@tag` comment per test to reference the owning feature/story | Low (10 min) |
| **P2** | 17 | After navigation, also assert that the *other* two nav links do **not** have `aria-current="page"` | Low (10 min) |
| **P2** | 4 | Add at least one negative test: assert that navigating to a deliberately wrong URL does **not** show the expected heading (verifies the heading assertion has real discriminating power) | Medium (20 min) |
| **P2** | 2 | Add inline comments next to each `heading` value in `navLinks` citing where it was verified (e.g., `// h1 as of playwright.dev 2026-03`) | Low (5 min) |
| **P3** | 5 | Add a keyboard navigation test using `page.keyboard.press('Tab')` to verify nav links are Tab-reachable | Medium (30 min) |
| **P3** | 13 | Export `NavLink` interface or move it to a shared types file | Low (5 min) |
| **P3** | 9 | Refactor POM `assertNavLink` to use a single `const link = this.navLink(name)` variable | Low (5 min) |
| **P3** | 16 | Add `await expect(page).toHaveTitle(...)` assertion to each per-link test | Low (10 min) |
| **P4** | 11 | Rename `test.describe` to `'playwright.dev — primary navbar'` | Trivial |
| **P4** | 12 | Expand the `aria-current` comment to cite ARIA spec and note Docusaurus dependency | Trivial |
| **P4** | 6 | Add a `Mobile Chrome` project to `playwright.config.ts` and annotate mobile-specific skips where needed | High (60 min) |
| **P4** | 10 | Extract URL paths to a shared constants module; import into both POM and test file | Medium (20 min) |
| **P4** | 7, 18 | Low priority; address during a dedicated accessibility/non-functional sprint | High |

---

## Summary Assessment

The refactored file is a **substantial improvement** over `main.navigation.spec.ts`: `waitForTimeout` is gone, selectors are role-based, POM is used consistently, `beforeEach` removes setup duplication, and a TypeScript interface is in place. The core positive-path flow is well-validated with URL, heading, and `aria-current` assertions.

The primary remaining gaps are:
1. **Fragile exact-URL match** (P1 — easy fix)
2. **Redundant pre-condition assertion** (P1 — needs a decision)
3. **No negative or keyboard-accessibility tests** (P2/P3 — meaningful coverage gaps)
4. **No traceability annotations** (P2 — process/tooling gap)
