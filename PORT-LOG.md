# flexform. — React Port Work Log

Started: 2026-11-02
Mode: ponytail ultra (push back on scope, minimal code)

## Decisions confirmed by user
1. Keep originals under `public/legacy/` for side-by-side visual diff.
2. BrowserRouter with clean paths (`/trainers`).
3. Minimal "page not found" screen for unknown routes.
4. Footer takes per-page copy as props — pixel-identical everywhere.
5. Keep `?mockfail` switch as-is (works per-route).
6. npm/node available; may install deps and run dev server.
7. Port everything as-is; nothing dropped.

## Scope
- Port every HTML page, CSS file, JS module to Vite + React + React Router.
- Pixel-identical UI; technology change only.
- No new dependencies beyond vite, react, react-dom, react-router-dom.
- No backend, no auth, no new features.

## Progress
- [x] Scaffold Vite project
- [x] Copy CSS files byte-for-byte
- [x] Copy data files to src/data/
- [x] Port lib modules (auth, stores, theme, tools-math)
- [x] Build layout components (AppShell, Sidebar, Topbar, Footer, MobileNav, Toast, NotificationPanel)
- [x] Build page components
- [x] Wire up routing in main.jsx
- [x] Copy originals to public/legacy/
- [x] Verify build succeeds (`npm run build` → 87 modules, dist/index.html 1.24 kB, CSS 53.7 kB, JS 376.56 kB)
- [x] Dev server starts cleanly (no console errors at startup)
- [x] Fix black screen issue:
  1. Removed `hidden` class on root `<div id="app" className="app">` in AppShell, Login, Signup.
  2. Created `src/lib/data-loader.js` to expose mock data (`window.courses`, `window.trainers`, `window.coachProfiles`, `window.plans`, `window.plannerWorkouts`, `window.plannerMeals`, `window.lessonsFor`, `window.coachSlug`, `window.flexformNotifications`) on startup via `main.jsx`.
  3. Added export statements to data modules (`courses-data.js`, `trainers-data.js`, `coach-profiles-data.js`, `pricing-data.js`, `planner-data.js`, `lessons-data.js`).
- [x] Cleanup: deleted 51 redundant root legacy files (duplicates of `public/legacy/`, verified byte-identical via `diff`); build still green
- [ ] Visual comparison (1440/900/560/390, light/dark, guest/member)
- [ ] Click-through verification
- [ ] Final report

## Files created
- `src/main.jsx` — Router + AuthProvider + routes
- `index.html` — Vite entry with theme script in `<head>` (pre-paint)
- `vite.config.js` — React plugin, `base: "./"`
- `src/pages/Signup.jsx` — two-step signup → verify flow
- `src/pages/NotFound.jsx` — minimal 404
- `src/components/layout/Topbar.jsx` — + protected-link/guest-only/auth-only sync (mirrors common.js applyAuthState)
- CSS imports added to all page components (per legacy cascade order)

## Bugs fixed during build
- `src/pages/Planner.jsx` escapeHtml entity map had unescaped `"` → fixed to `"`
- `src/lib/utils.js` escapeHtml same bug → fixed
- `src/components/layout/Sidebar.jsx` duplicate `className` on protected NavLink → merged into one function className
- `src/components/layout/MobileNav.jsx` same duplicate → merged

## Known port-fidelity notes
- Pages that used `innerHTML` templates (Courses, CourseDetail, Pricing, TrainerCard) keep `dangerouslySetInnerHTML` — matches original behavior exactly.
- Theme toggle in Topbar recreates `common.js addThemeToggle` via DOM injection.
- Notification panel in Topbar recreates `common.js` notification logic.
- `flexformSplashSeen` in sessionStorage gates the splash once per tab (Home.jsx inline script).
- `?return=` param mapped through `auth-ui-utils.returnPage` (`.html` filenames → routes).
- All `window.flexform*` globals preserved: flexformAuth, flexformAuthUI, flexformUsers, flexformActivity, flexformCourses, flexformTools, flexformTheme, flexformApi, flexformNotifications.
- CSS cascade per page: styles.css first, then page-specific (home.css, trainers.css, courses.css, course-detail.css, coach.css, lesson.css, tools.css, pricing.css, planner.css, profile.css, auth.css) — exactly matching legacy.
## Bug-fix pass (React branch)

- **CSS**: `src/styles/*.css` are now generated from the untouched `public/legacy/*.css` by `npm run scope-css`
  (`scripts/scope-css.mjs`). Each page sheet is scoped to the `body[data-page]` values whose original HTML loaded it
  (home, trainers, courses/course/coach/lesson/planner, login/signup, …), so colliding selectors (`.link-button`,
  `.upcoming`, …) no longer leak between routes. Sheets are imported once, in original cascade order, in `main.jsx`.
  The splash screen styles live in `load.css`.
- **Build/runtime**: Signup JSX syntax error; Profile `isLoggedIn` ReferenceError; `window.flexform` helpers ported
  (`src/lib/common.js`); Lesson no longer crashes after enrolling from the locked state; Login root no longer `hidden`;
  Home renders Guest *or* Member (member view was permanently hidden); greeting uses the signed-in name.
- **Auth/nav**: `ProtectedRoute` for /profile and /planner; `?return=` accepts `/route` and legacy `*.html`; Signup
  refreshes auth after verifying; sidebar/mobile nav active states follow the original (course/lesson → Courses,
  coach → Find a coach; "Today" no longer always active); "Sign in"/protected links follow auth state; Topbar is
  declarative React (no direct DOM class toggling).
- **Other**: coach slugs use `coachSlug` (accents); chat panel only renders when open; Pricing/Courses render in JSX
  instead of innerHTML; Tools inputs were read-only (`value` without `onChange`) → `defaultValue`, listeners are cleaned
  up (StrictMode-safe, timer cleared), math imported from `tools-math.js`, name escaped; `vite.config.js` `base: "/"`
  (deep links); `npm test` script; real storage-key / return-page / slug / CSS tests; screenshot slug `maya-chen`.
- **Not verified by running**: this pass was done without network access, so `npm install`, `npm run build` and
  `npm test` still need to be run locally. Source was syntax-checked only.
