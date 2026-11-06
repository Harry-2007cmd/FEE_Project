# Prompt: Convert the "flexform." vanilla site into a React frontend

Hand this whole file to the coding agent. It is written from the original source files (HTML, CSS, JS, README), not from memory.

---

## 0. Your role and ground rules

You are a senior frontend engineer migrating an existing, working, **frontend-only** website (plain HTML + CSS + vanilla JS, `localStorage` for state, mock data in JS files) into a **React app**.

**This is a port, not a redesign.** The goal is behavioural and visual parity with the original. Live reference: https://fee-project-mu.vercel.app/ and the original source files in the repo (main branch). The original is the source of truth. When this document and the original disagree, the original wins and you tell me.

Hard rules:

1. **Do not assume. Do not hallucinate requirements.** If something is ambiguous, contradictory or a design/UX decision, STOP and ask numbered questions. Do not silently pick.
2. **Frontend only.** No backend, database, server, real auth or payments. Everything that is mock stays mock (see section 3), and stays clearly labelled as mock.
3. **No redesign.** Same layout, copy, colours, fonts, spacing, dark/light theme, responsive behaviour. Suggestions go in a "Suggestion:" note; do NOT implement them without my approval.
4. **No new dependencies without asking**, other than those approved in section 1.
5. **Do not fix original bugs silently.** Port the behaviour as-is, log it in `MIGRATION_NOTES.md` under "Original quirks", and ask whether to fix. (Known quirks are listed in section 8.)
6. **Accuracy over speed.** Work checkpoint by checkpoint (section 6). At each checkpoint run the listed tests, show me the output, and **wait for my "go" before starting the next one**.
7. Keep the original files untouched. Build the React app in a new folder (see section 2) so I can compare side by side.

---

## 1. Decisions I must confirm BEFORE you write code (Checkpoint 0)

Ask me these as a numbered list, each with the recommended default, and wait. I may pre-fill answers here:

| # | Decision | Recommended default | My answer |
|---|----------|--------------------|-----------|
| 1 | Build tool | Vite + React 18 | |
| 2 | Language | TypeScript (strict). Alternative: plain JS | |
| 3 | Router | React Router v6 (`BrowserRouter`) + a `vercel.json` SPA rewrite so deep links work on Vercel | |
| 4 | URL shape | Keep query strings like the original: `/course?id=quiet-cardio`, `/lesson?course=...&n=3`, `/coach?id=tomas-silva`, `/login?return=profile`. Alternative: path params (`/courses/:id`) | |
| 5 | Styling | Keep the original CSS files nearly as-is (global `styles.css` + per-page CSS imported by the page component). Alternative: CSS Modules | |
| 6 | State | React Context + small custom hooks over the same localStorage keys. No Redux/Zustand | |
| 7 | Tests | Vitest + React Testing Library for logic and key flows. Optional Playwright smoke test | |
| 8 | Folder | New folder `react-app/` inside the repo (original files untouched) | |
| 9 | Fonts | Keep Google Fonts links (Space Grotesk, DM Sans) | |
| 10 | Page `<title>` and meta description per page | Keep the originals, set per route | |

Do not proceed until every row is answered or I say "use defaults".

---

## 2. Target structure (adjust only if I approve different answers above)

```text
react-app/
├── index.html                  # fonts, theme bootstrap (see 4.1)
├── vercel.json                 # SPA rewrite
├── src/
│   ├── main.tsx
│   ├── App.tsx                 # routes
│   ├── styles/                 # copies of original CSS, see 5
│   ├── data/                   # MOCK DATA, one file per original *-data.js
│   ├── services/               # ports of auth.js, user-store, course-store, activity-store (pure logic, no JSX)
│   ├── context/                # AuthContext, ThemeContext, ToastContext
│   ├── hooks/
│   ├── components/             # AppShell, Sidebar, Topbar, MobileNav, Footer, Toast, NotificationPanel, ...
│   ├── pages/
│   └── utils/                  # escape-free helpers, coachSlug, date helpers, formatPrice
└── MIGRATION_NOTES.md          # running log: decisions, quirks, deviations
```

---

## 3. Inventory of the original (what you are porting)

### 3.1 Pages (13 HTML files)

| Original | Route (default) | Notes |
|---|---|---|
| `load.html` | `/load` | Splash screen, sets `sessionStorage.flexformSplashSeen`, redirects to home after 1600 ms. No app shell. Its own inline styles. |
| `index.html` | `/` | Two views in one: **guest home** (hero, 3 feature cards, 3 coach previews, FAQ with `<details>`) and **member home** (rhythm card, today's focus, schedule, stats, chart, challenge card, upcoming). Switched by login state. Has an in-page loader (`#siteLoader`) shown once per tab session. |
| `trainers.html` | `/trainers` | Search, 4 specialty chips + "All coaches", availability select, pagination (8 per page), save (heart), book, chat panel, "Find my match" `<dialog>`. Supports `?chat=<name>`. |
| `coach.html` | `/coach?id=<slug>` | Coach profile. Not-found state. |
| `courses.html` | `/courses` | Free-class banner + 10 course cards with progress. |
| `course.html` | `/course?id=<id>` | Course detail, enrol / leave, progress block, syllabus (locked until enrolled), reviews, trainers, "good to know". Not-found state. |
| `lesson.html` | `/lesson?course=<id>&n=<n>` | Placeholder video, mark complete toggle, pager, lesson list. Locked state if not enrolled (offers enrol). Not-found states for course and lesson. |
| `planner.html` | `/planner` | **Members only.** Week navigation, day tabs, add form, tick/remove. |
| `tools.html` | `/tools` | Body check-in (BMI + Mifflin-St Jeor), recommender, weekly goal, water, one-rep max, macros, session timer. |
| `profile.html` | `/profile` | **Members only.** Progress stats, charts, weight log, edit profile, logout, static upcoming bookings. |
| `login.html` | `/login` | No app shell. Demo account, lockout, remember-me, show/hide password. |
| `signup.html` | `/signup` | No app shell. Two steps (form, then verification with demo inbox). |
| `pricing.html` | `/pricing` | 3 mock plans, saves choice per user. |

### 3.2 Shared app shell (used by every page except load, login, signup)

Fixed sidebar (desktop, hidden at 900px and below), sticky top bar (brand on mobile, "Your wellness, on your terms" message, theme toggle, bell, Log in / Sign up for guests, user chip + Log out for members), floating bottom mobile nav, footer (About us, Contact us, Plans & pricing link), toast element, notification panel. Currently duplicated by hand in each HTML file: this becomes **one `AppShell` layout component** with the active nav item derived from the route.

### 3.3 Original scripts to port

| Original | Becomes |
|---|---|
| `theme.js` | `ThemeContext` + inline bootstrap script in `index.html` (must still apply `data-theme` before first paint) |
| `auth.js` | `services/auth.ts` (pure logic) + `AuthContext` |
| `auth-ui.js` | `utils/authUi.ts` (return-page allow-list, delay) + form hooks |
| `user-store.js` | `services/userStore.ts` |
| `course-store.js` | `services/courseStore.ts` + `useCourses` hook |
| `activity-store.js` | `services/activityStore.ts` + `useActivity` hook |
| `common.js` | `AuthContext`, `AppShell`, `NotificationPanel`, protected-route component |
| `index.js` | `pages/Home` (+ `data/todaySchedule.ts`) |
| `trainers.js` | `pages/Trainers` and its child components |
| `coach.js`, `course.js`, `lesson.js`, `courses.js`, `planner.js`, `pricing.js`, `profile.js` | one page component each |
| `tools.js` + `tools-extra.js` | `pages/Tools`, plus pure functions in `utils/tools.ts` |
| `login.js`, `signup.js` | `pages/Login`, `pages/Signup` |

### 3.4 Mock data files (copy values EXACTLY, convert to typed modules)

`trainers-data.js` (20 coaches, 5 per specialty, with scripted chat), `coach-profiles-data.js` (20 profiles + `coachSlug`), `courses-data.js` (10 courses), `lessons-data.js` (lesson lists + `lessonsFor`), `pricing-data.js` (3 plans), `planner-data.js` (workouts, meals), `notifications-data.js` (3 notifications), and `todaySchedule` inside `index.js`. Keep them in `src/data/` and mark each with a header comment `// MOCK DATA`.

### 3.5 Storage keys. These MUST stay byte-for-byte identical

So a user who already has data in the original keeps it in the React version.

`localStorage`: `flexformAccounts`, `flexformSession`, `flexformInbox`, `flexformVerification`, `flexformLoginAttempts`, `flexformLoggedIn`, `flexformUserName`, `flexformUserEmail`, `flexformUsers`, `flexformTheme`, and per user `flexform:<email or guest>:<kind>` for kinds `savedCoaches`, `bookedCoaches`, `courseProgress`, `weeklyGoal`, `planner`, `lessonProgress`, `weightLog`, `plan`.

`sessionStorage`: `flexformSplashSeen`, `flexformTabSession`, `flexformPendingEmail`.

Every storage access stays wrapped in try/catch exactly like the original (private windows must not crash the app).

---

## 4. Behaviours that must be preserved (non-obvious ones)

### 4.1 Theme
- Saved choice (`light`/`dark`) wins; otherwise follow `prefers-color-scheme` live.
- `data-theme` must be set on `<html>` **before first paint** (inline script in `index.html`, no flash).
- Toggle button (☀ / ☾) is added to the top bar's actions, first child. Dispatches theme change.

### 4.2 Auth (mock, keep it mock)
- Name rule: 2 to 60 chars, letters/spaces/apostrophes/dots/hyphens (unicode letters allowed).
- Password: 8 to 64 chars, upper + lower + number, common-password list rejected; strength meter score 1 to 4 and rule checklist update live.
- Passwords stored as salted PBKDF2-SHA-256 (100000 iterations) via Web Crypto, with the weak fallback hash when Web Crypto is missing. Port this faithfully (including `alg` field) so existing accounts still verify.
- Verification code: 6 digits, expires in 10 min, max 5 wrong attempts, resend cooldown 30 s, written to the on-page demo inbox (max 20 messages stored, 3 shown).
- Login: vague error message ("Incorrect email or password."), 5 failures lock for 30 s with live countdown, unverified account is redirected to `/signup?verify=1` with a fresh code, "Remember me" = 30 days, otherwise tab-only session via `sessionStorage`.
- Demo account `demo@flexform.com` / `Demo1234` is seeded on load; "Fill it in" button on login.
- Logged-in users visiting login/signup are redirected away (to the allow-listed return page).
- `return` param is allow-listed: `index, trainers, courses, tools, profile, planner, pricing` (map to the new route names, anything else goes home).
- Logout clears session, tab session, pending email and legacy mirror keys, then goes to home.
- Edit profile: `updateAccount` + `renameEmail` migrates the 8 per-user keys when the email changes; changing email does NOT re-verify.

### 4.3 Route protection
`/profile` and `/planner` redirect guests to `/login?return=<page>`. Protected links in the sidebar/mobile nav are hidden for guests and, if clicked, redirect to login with `return`. Implement as a single `<ProtectedRoute>`; guests must never see a flash of protected content.

### 4.4 Shell visibility rules (from `updateAuthUI`)
- `.guest-only` shown when logged out; `.auth-only` shown when logged in; both hidden on the profile page's top bar (profile has its own logout in the account card). Port this exactly and note it in quirks.
- Login/Signup links hidden for logged-in users except on the auth pages.
- Greeting uses first name + "."; user chip shows initials (max 2) and full name; name visually hidden at 420px and below but still readable by screen readers.

### 4.5 Splash and loader
- `load.html` splash redirects after 1600 ms and marks `flexformSplashSeen`.
- Home page loader shows once per tab session and removes itself after 1600 ms; skipped if the flag is already set.

### 4.6 Find a coach
- Search matches name or role (case-insensitive). Specialty chips. Availability: "this week" includes coaches free today; "today" only today.
- 8 per page, pager with prev/next, page resets to 1 on any filter change, count text: `N coaches match your search · showing a–b` when more than one page.
- Save heart toggles and persists; Book persists as "✓ Request sent" and cannot be undone.
- Chat panel: greeting with `{user}` replaced by first name, tappable prompts, typed messages matched by keywords else `fallback`, reply after 700 ms, chat state resets when switching coach.
- "Find my match" dialog uses native `<dialog>` (modal, backdrop click closes). If nobody in that specialty is free today it falls back to "this week" and shows a toast saying so.
- `?chat=<name>` opens that coach's chat on load.
- Empty state with "Reset filters".

### 4.7 Courses, enrol, lessons
- Course card progress = completed lessons / `course.lessons`. "Start course" marks it started (stored by **course title**, not id). Free-class banner scrolls to and clicks the "Quiet cardio" card.
- Course detail: enrol / leave, price `$N` or "Free", lessons locked (🔒) until enrolled, progress block with Start / Continue / Review.
- Lesson minutes are derived: `floor(total / count)` with the remainder added to the first lessons (see `lessonsFor`).
- Lesson page: complete toggle, `aria-pressed`, previous/next, final lesson links back to the course; completion toast text differs when the course is finished.

### 4.8 Planner
Monday-start weeks, previous/next/"This week", day tabs show done/total, week progress bar, add workout/meal/enrolled-course item, tick, remove. Course item minutes = `max(5, round(course.minutes / course.lessons))`. Focus management after actions (focus returns to the tab / item) must be kept.

### 4.9 Profile / progress
All numbers are computed from planner completions + completed lessons: hours, streak (counts back from today or yesterday), completed count, 30-day active days / minutes / lessons, weekly goal progress (goal from Tools, default 3), week bar chart, recent activity (6), weight log (25 to 300 kg, one entry per date, no future dates, chart needs 2+ entries, shows last 10 in chart and 5 in list). "Upcoming bookings" is static sample content.

### 4.10 Tools (pure math: port into `utils/tools.ts` and unit test)
BMI, Mifflin-St Jeor (+5 male / −161 female), water (35 ml/kg + 350 ml per 30 min), Epley one-rep max, macro split (balanced 30/40/30, lose 35/35/30, build 30/45/25; 4/4/9 kcal per g), session timer (interval and breathing patterns box/478/calm, pause/resume/reset, validation ranges, live-region announcements). Validation ranges and error messages are copied from the original.

### 4.11 Accessibility details already in the original (do not regress)
Skip nothing: `aria-live` regions (chat, notifications, results), `aria-pressed` on hearts/toggles, `aria-expanded` on bell and edit-profile, `aria-current` on pager/day tabs/lesson list, `role="progressbar"` with values, `role="timer"`, `.sr-only` text, 2px coral `:focus-visible` ring, Escape closes notification panel and returns focus to the bell, labels on every input, 44 px touch targets on mobile.

---

## 5. Styling instructions

- Copy `styles.css`, `home.css`, `trainers.css`, `courses.css`, `course-detail.css`, `coach.css`, `lesson.css`, `planner.css`, `tools.css`, `profile.css`, `auth.css`, `pricing.css` into `src/styles/` **unchanged**. Import `styles.css` once in `main.tsx`; import each page stylesheet from its page component.
- Beware: the original loads page CSS per HTML page, so selectors from different pages can collide when everything is bundled globally (for example `.history-item`, `.upcoming`, `.progress-copy`, `.link-button`, `.sun-button` are defined in more than one file with slightly different rules). Vite loads CSS per route chunk, but once a page has been visited its CSS stays applied. **Checkpoint 2 must include a collision audit**: list every selector defined in 2+ files, and ask me whether to (a) scope each page under `body[data-page]`/a page wrapper class, or (b) move to CSS Modules. Do not decide silently.
- Preserve `data-page` on `<body>` or an equivalent wrapper if any CSS relies on it.
- Do not change any colour token, font, radius or spacing value.

---

## 6. Checkpoints (work in this order; stop at each gate)

At every checkpoint you must: (1) summarise what you did in under 10 lines, (2) run the **automated tests** listed, (3) paste the real output, (4) list the **manual checks** for me to do against the live original, (5) STOP and wait for "go".

### Checkpoint 0. Questions and plan
- Read all original files. Ask the section 1 questions plus any new ambiguities.
- Output a short plan: route table, component tree, state/context list, data layer.
- **Gate:** I approve the plan.

### Checkpoint 1. Scaffold + data + pure logic (no UI yet)
Do: create the Vite app, copy mock data to typed modules, port `coachSlug`, `lessonsFor`, tools math, date helpers, `activityStore`, `courseStore`, `userStore`, `auth` as **framework-free services**.

Automated tests (Vitest, all must pass). Use these exact expected values from the original formulas:
- `coachSlug("Tomás Silva") === "tomas-silva"`, `coachSlug("Maya Chen") === "maya-chen"`.
- Data integrity: `trainers.length === 20`; each of Strength / Performance / Mindful movement / Nutrition has exactly 5; `courses.length === 10`; every `course.trainers` name exists in `trainers`; every trainer has a `coachProfiles` entry; for every course `lessonsFor(course).length === course.lessons` and the minutes sum to `course.minutes`.
- `lessonsFor` on `start-strong` (44 min, 7 lessons) gives minutes `[7,7,6,6,6,6,6]`.
- Tools: `oneRepMax(60, 8) === 76`; `oneRepMax(100, 1) === 100`; `waterMl(68, 30) === 2730`; `macroGrams(2000,"balanced")` is protein 150, carbs 200, fat 67; BMI for 170 cm / 68 kg is `23.5`; Mifflin-St Jeor for 170 cm, 68 kg, age 31 gives 1593 (male) and 1427 (female) with the original rounding.
- Dates: `weekStart("2026-11-06")` is `"2026-11-02"` (Monday); `addDays` crosses month ends correctly; `streak` counts back from yesterday when today is empty and stops at the first gap.
- Auth: `validateEmail`, `validateName`, `validatePassword` accept/reject the same inputs as the original (include a unicode name like `"Zoë O'Neil"`, a 65-char password, `"password1"` rejected as common); `passwordStrength("")` score 0; hashing then `checkPassword` round-trips; five wrong logins lock for ~30 s; a correct code verifies; the sixth wrong code attempt is rejected.
- Storage keys: a test asserts every key string in section 3.5 appears exactly as written in the services.
- `npm run build` and `npm run lint` succeed.

**Gate:** all tests green + I approve.

### Checkpoint 2. Shell, theme, routing, auth context, styles
Do: `AppShell` (sidebar, topbar, mobile nav, footer, toast, bell), `ThemeContext`, `AuthContext`, `ProtectedRoute`, router with every route stubbed to a placeholder, CSS imports, CSS collision audit (section 5).

Automated tests (React Testing Library):
- Guest sees Log in / Sign up, no user chip; logged-in user sees chip with initials and Log out.
- Visiting `/profile` or `/planner` as guest redirects to `/login?return=...`; after login you land on the return page; a bad `return` value lands home.
- Bell opens, `aria-expanded` toggles, Escape closes and refocuses the bell, outside click closes; guests see "You're all caught up.", members see 3 notifications.
- Theme toggle flips `data-theme` and persists `flexformTheme`; with no saved value it follows `prefers-color-scheme`.
- Sidebar/mobile nav active item matches the route.

Manual checks (me): open original and React side by side at 1440, 900 and 390 px wide, light and dark. Shell must look pixel-close. No flash of wrong theme on reload.

**Gate:** I approve.

### Checkpoint 3. Public pages: Home (guest + member), Pricing, Load/Splash
Tests: guest home renders hero, 3 feature cards, 3 coach previews, 4 FAQ items (first open); member home shows greeting with first name, the 3 schedule items, 4 stat tiles; splash flag logic (shows once per tab, `load` redirects after 1600 ms with fake timers); pricing shows 3 plans, "Most popular" on Plus, choosing a plan persists `flexform:<email>:plan` and disables that button.

**Gate:** I approve.

### Checkpoint 4. Auth pages: Login and Signup
Tests: every rule from section 4.2. Specifically: password toggle label/aria changes; strength bars and checklist update live; mismatched confirm shows "The passwords don't match."; signup moves to verify step and the demo inbox shows the code; resend disabled during cooldown; wrong code message shows attempts left; success signs in and goes home; refreshing mid-verification resumes the verify step; login demo fill; lockout countdown disables submit; logged-in user is redirected away; unverified login goes to `/signup?verify=1`.

Manual: complete a real signup in the React app, then compare to the original.

**Gate:** I approve.

### Checkpoint 5. Coaches: Trainers list, Coach profile, chat, match dialog
Tests: 20 coaches, 3 pages (8/8/4); search "yoga" narrows; chip + availability combos including the "this week includes today" rule; page resets on filter change; save and book persist and survive remount; chat greeting uses first name, prompt click adds question + answer after 700 ms, keyword typed message matches, unknown message gets `fallback`; match dialog fallback toast when nobody is free today; `/trainers?chat=Maya%20Chen` opens chat; coach profile shows courses taught derived from `courses`; unknown id shows not-found.

**Gate:** I approve.

### Checkpoint 6. Courses: list, detail, lesson player
Tests: 10 cards, free-class button starts Quiet cardio; enrol then leave updates button, lock icons and progress block; locked lesson page offers enrol, then plays; complete toggle updates progress `n of m · p%` on lesson, detail and list pages; last lesson links back to course; not-found states for bad course id, bad lesson number, non-numeric `n`.

**Gate:** I approve.

### Checkpoint 7. Planner, Tools, Profile
Tests: planner week navigation, day tab counts, add/tick/remove, course option only for enrolled courses, "Enrol in a course first" hint when none; every Tools validation message from the original; timer with fake timers (interval: work, rest, final round has no rest; breathing patterns; pause/resume/reset; done state); goal save/persist/"Weekly goal saved" label logic; profile numbers match a seeded fixture (seed planner + lessons + weights, assert hours, streak, 30-day numbers, chart bar heights, weight list diffs with `+`/`−` formatting); weight form validation and remove; edit profile with duplicate email rejected, email change migrates the 8 keys.

**Gate:** I approve.

### Checkpoint 8. Parity audit, accessibility, responsive, cleanup
Do:
1. Produce a **parity matrix** (file `PARITY.md`): every original page and every behaviour in section 4, with status Pass / Differs / Not ported and how it was verified.
2. Run an automated a11y scan (axe via `vitest-axe` or Playwright + axe) on every route, light and dark. Report violations and compare against the original's known items (large coral headline accents ~2.6:1, yellow stat numbers on beige, green "Available" labels ~3.8:1). Report only; do not change colours without approval.
3. Responsive pass at 1440, 1024, 900, 768, 560, 420, 390, 360 px: sidebar becomes bottom nav at 900, single columns at 560, avatar-only chip at 420, brand text hidden at 360. No horizontal scroll anywhere.
4. Dead code, unused deps, console errors/warnings: none.
5. Optional Playwright smoke test: signup (via demo inbox code) then enrol in a course, complete a lesson, plan it, tick it, see it on Profile.
6. `npm run build` + `npm run preview`, and confirm `vercel.json` makes a hard refresh on `/course?id=quiet-cardio` work.

**Gate:** I sign off.

---

## 7. Global "am I going in the right direction?" tests

Run these at every checkpoint after CP1 and report pass/fail:

1. **Build health:** `npm run build`, `npm run lint`, `npx tsc --noEmit` (if TS) all clean; browser console has zero errors and zero React warnings on every route built so far.
2. **Data compatibility test:** load the ORIGINAL site, sign up and do things (save a coach, enrol, complete a lesson, plan items, log weight). Then open the React app on the same origin/localStorage (or import the same keys) and confirm everything appears. This proves keys and shapes are unchanged.
3. **No duplicated UI:** the shell exists once; no page re-implements sidebar/topbar/footer/toast.
4. **No invented content:** diff every user-visible string against the original (`grep` the original for each string you typed). Anything not found in the original is a violation. List it.
5. **No new files outside the agreed folders** and no unapproved dependencies (`package.json` diff shown).
6. **Screenshots:** for each finished page, capture original vs React at 1440 and 390 px (light and dark) and show them side by side.
7. **Scope guard:** if you are about to add a backend call, a state library, an animation, an icon library or a visual change not in the original, stop and ask.

---

## 8. Known original quirks (port as-is, log in `MIGRATION_NOTES.md`, ask before fixing)

1. The member home page is mostly static sample content: date line "Tuesday, October 24 · Week 6", stats, chart, schedule, "Start today's flow" only changes the button text and shows a toast.
2. Profile page: "Upcoming bookings" is static; the top-bar user chip and top Log out are hidden on that page by design, so logout is only in the account card.
3. Course "started" state is keyed by course **title**, not id.
4. `escapeHtml` / `stars` / `notify` / `toast` helpers are copy-pasted across several scripts. Replace with shared utilities (this is a refactor, not a behaviour change).
5. The README's "Add a course" instructions mention `courses.js`, but the data actually lives in `courses-data.js`. README is stale in places; trust the code.
6. Several CSS selectors are defined in multiple files (see section 5).
7. Contact info and copy differ slightly between pages' footers ("About us" paragraph text is not identical on every page). Keep each page's own text exactly (ask me if you would rather unify it).
8. `tools.html` first card labels include units in the label text ("Height (In cm)"). Keep.
9. Plans are display-only; nothing is gated by plan.
10. Lesson videos are placeholders.
11. Auth is simulated and not secure; this is intended and must stay clearly labelled as demo.

---

## 9. Definition of done

- Every route in section 3.1 works with the same behaviour as the original.
- All Vitest tests pass; a11y scan has no NEW violations compared to the original.
- Same `localStorage` / `sessionStorage` keys and data shapes.
- Looks identical at all breakpoints in both themes.
- `PARITY.md` is complete, `MIGRATION_NOTES.md` lists every decision and quirk, and I have signed off Checkpoint 8.

## 10. Reporting format for each checkpoint

```text
### Checkpoint N — <name>
Done: (max 10 lines)
Automated tests: (paste real output)
Global tests 1-7: (pass/fail each)
Deviations from original: (or "none")
Questions: (numbered, or "none")
Manual checks for you: (bullets)
Waiting for: "go"
```

**Golden rule: don't guess, don't hallucinate, don't assume. Ask first, then build exactly what I approve.**
