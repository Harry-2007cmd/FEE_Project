# flexform.

A warm, editorial wellness and coaching website. Browse coaches, try short courses, use simple health tools and keep a personal profile.

> **This is a frontend-only project.** There is no backend, database or real authentication. Everything that looks like data (coaches, courses, workout history, schedule) is **mock data** in the JavaScript files, and accounts, sign-in and email verification are **simulated in the browser** with `localStorage` (see [Authentication](#authentication-mock)).

---

## Table of contents

1. [Quick start](#quick-start)
2. [Tech stack](#tech-stack)
3. [Project structure](#project-structure)
4. [Pages](#pages)
5. [How it works](#how-it-works)
6. [Mock data](#mock-data)
7. [localStorage keys](#localstorage-keys)
8. [Design system](#design-system)
9. [Responsive behaviour](#responsive-behaviour)
10. [Accessibility](#accessibility)
11. [Common tasks](#common-tasks)
12. [Known limitations](#known-limitations)

---

## Quick start

There is no build step and no dependencies to install.

1. Clone the repository.
2. Open `index.html` in a browser, or start from `load.html` for the splash screen.
3. Optionally serve the folder locally so paths behave like a real site:

   ```bash
   npx serve .
   # or
   python3 -m http.server 8000
   ```

Fonts load from Google Fonts, so the first load needs an internet connection. Without it, the browser falls back to system fonts.

---

## Tech stack

| Area      | Choice                                                              |
| --------- | ------------------------------------------------------------------- |
| Markup    | Plain HTML5, one file per page                                      |
| Styling   | Plain CSS with custom properties, no preprocessor or framework      |
| Behaviour | Vanilla JavaScript (no framework, no bundler, no npm dependencies)  |
| Fonts     | Space Grotesk (headings) and DM Sans (body) from Google Fonts       |
| State     | `localStorage` only                                                 |

---

## Project structure

```text
.
├── load.html            Splash screen, redirects to index.html after 1.6s
├── index.html           "Today" page (guest view and member view)
├── trainers.html        Find a coach
├── courses.html         Courses list (10 courses)
├── course.html          Course detail page (course.html?id=<slug>)
├── courses-data.js      MOCK course catalogue
├── course-store.js      Per-user enrol/started courses (localStorage)
├── lesson.html          Lesson player (lesson.html?course=<id>&n=<number>)
├── lessons-data.js      MOCK lesson lists for each course
├── coach.html           Coach profile page (coach.html?id=<slug>)
├── coach-profiles-data.js  MOCK coach bios, sessions, reviews; coachSlug()
├── pricing.html         Plans page (Free / Plus $9 / Pro $19, mock)
├── pricing-data.js      MOCK plans
├── planner.html         Weekly planner (members only)
├── planner-data.js      MOCK workout and meal choices for the planner
├── activity-store.js    Per-user planner, lesson progress and weight log + derived stats
├── theme.js             Light/dark theme (loaded in <head> of every page)
├── tools-extra.js       Water, one-rep max, macro split and timers on tools.html
├── tools.html           Body check-in, recommender, weekly goal
├── profile.html         Profile (login required)
├── login.html           Simulated sign in
├── signup.html          Simulated sign up + email verification
│
├── styles.css           Shared styles: tokens, layout shell, buttons, nav, footer
├── home.css             Styles for index.html
├── trainers.css         Styles for trainers.html (cards, filters, chat)
├── courses.css          Styles for courses.html
├── tools.css            Styles for tools.html
├── profile.css          Styles for profile.html
├── auth.css             Styles for login.html and signup.html
│
├── common.js            Shared app-shell behaviour (auth UI, logout, notifications)
├── notifications-data.js MOCK DATA: sample notifications for the bell panel
├── user-store.js        Mock per-email user records (remembers names, migrates data on email change)
├── index.js             Home page: guest/member view, schedule, "complete flow"
├── trainers.js          Coach list, search, filters, save/book, mock chat
├── trainers-data.js     MOCK DATA: coaches and their scripted chat content
├── courses.js           Course list and course/free-class interactions
├── tools.js             BMI/calorie estimate, recommender, goal picker
├── profile.js           Profile details and mock workout history
├── auth.js              Simulated accounts, hashing, verification codes, lockout, sessions
├── auth-ui.js           DOM helpers for the login/signup forms
├── login.js             Login page behaviour
└── signup.js            Signup + verification page behaviour
```

Each page loads `styles.css` first, then its own stylesheet. Pages with the app shell load `common.js` **before** their own script.

| Page          | Stylesheets               | Scripts                                   |
| ------------- | ------------------------- | ----------------------------------------- |
| `index.html`  | `styles.css`, `home.css`  | `notifications-data.js`, `auth.js`, `common.js`, `index.js` |
| `trainers.html` | `styles.css`, `trainers.css` | `notifications-data.js`, `auth.js`, `common.js`, `trainers-data.js`, `trainers.js` |
| `courses.html` | `styles.css`, `courses.css` | `notifications-data.js`, `auth.js`, `common.js`, `courses.js` |
| `tools.html`  | `styles.css`, `tools.css` | `notifications-data.js`, `auth.js`, `common.js`, `tools.js` |
| `profile.html` | `styles.css`, `profile.css` | `notifications-data.js`, `auth.js`, `common.js`, `user-store.js`, `profile.js` |
| `login.html`, `signup.html` | `styles.css`, `auth.css` | `auth.js`, `auth-ui.js`, then `login.js` / `signup.js` |

---

## Pages

### `load.html` — splash
Shows a loader and redirects to `index.html` after about 1.6 seconds. The splash shows once per browser tab session (tracked with `sessionStorage`). `index.html` has its own loader for direct visits and skips it if the splash was already shown in this tab.

### `index.html` — Today
Two views in one page, switched by login state:

- **Guest view:** hero, feature highlights, three coach previews and an FAQ.
- **Member view:** weekly rhythm, today's focus, a "mark flow complete" button, today's schedule, stats, a steps chart and upcoming sessions.

### `trainers.html` — Find a coach
- Search by name or focus, filter chips (Strength, Performance, Mindful movement, Nutrition) and an availability dropdown (Any time, Available today, Available this week). Availability is mock data; "this week" includes coaches free today.
- **20 mock coaches** (5 per filter) rendered from `trainers-data.js`.
- **Book a session** and **Save (heart)** on each card. Both persist per user.
- **Chat with…** opens a mock chat panel (see [Mock coach chat](#mock-coach-chat)).
- A **Find my match** dialog asks two questions (what you want to feel more of, and when you want to start), then sets the matching specialty filter and availability. If nobody in that specialty is free today, it falls back to "this week" and says so.

### `courses.html` — Courses
- A free class banner. "Try the free class" starts the *Quiet cardio* course: it scrolls to the card and marks it started.
- Ten course cards rendered from `courses-data.js`, each with level, lessons, minutes, price, a progress bar, a start/continue button and a **Details →** link (the title also links) to the detail page.

### `course.html` — Course detail
Opened as `course.html?id=<slug>`. Shows the price and an **Enrol** button (mock: saves the course to the user's list, no payment; **Leave course** undoes it), *What you'll learn*, a *Timeline*, *Reviews* (sample), *Trainers involved* (names must match coaches in `trainers-data.js`) and *Good to know*. An unknown or missing `id` shows a "couldn't find that course" state. Prices are US dollars and formatted in `course-store.js` (`formatPrice`); `0` shows "Free".

### `lesson.html` — Lesson player
Opened as `lesson.html?course=<id>&n=<number>`. Only for members enrolled in the course (otherwise it offers to enrol). Shows a **placeholder** video, the lesson title and summary, a **Mark lesson complete** toggle, previous/next links and the full lesson list with ticks and a progress bar. Completing lessons drives the progress bars on `courses.html` and `course.html` and counts towards streaks and minutes on My progress.

### `coach.html` — Coach profile
Opened as `coach.html?id=<slug>` (slug from `coachSlug(name)`, e.g. `tomas-silva`). Bio, approach, sessions, sample reviews, courses the coach teaches (worked out from `courses-data.js`) and credentials. **Book a session** and **Save** use the same per-user data as the Find a coach page; **Chat** opens `trainers.html?chat=<name>`.

### `pricing.html` — Plans
Three mock plans from `pricing-data.js`. **Choose** saves the plan for the user (`plan` key). Plans are not enforced anywhere. Linked from every page's footer.

### `planner.html` — Weekly planner (members only)
A Monday–Sunday week with previous/next week. Tap a day, then add a workout, a meal or a session of an enrolled course from a list, tick items off or remove them. Guests are sent to log in and returned here.

### `tools.html` — Tools
- **Body check-in:** BMI and a daily energy estimate from height, weight, age and sex (Mifflin-St Jeor: +5 male, −161 female).
- **What suits you?** A rule-based recommender from lifestyle and free time.
- **Weekly goal:** pick 1 to 6 movement moments.

### `profile.html` — My progress
Protected page. Real progress tracking computed from the member's own activity (ticked-off planner items and completed lessons): move hours, day streak, completed count, active days and minutes over 30 days, weekly goal progress (from the goal saved in Tools), an activity-by-day chart, recent activity, and a **weight log** with a trend chart (25–300 kg, one entry per date, no future dates). New members see zeros and empty states. Upcoming bookings are still static sample content. **Edit profile** opens an inline form to change name and email. If you are not logged in it redirects to `login.html?return=profile.html`.

### `login.html` / `signup.html`
Simulated sign up and sign in with real-looking validation. **Sign up** checks your name, email and password (with a live rule checklist and strength meter), then asks you to verify your email with a 6-digit code that appears in an on-page **demo inbox**. **Sign in** needs an existing, verified account. A demo account is pre-created: `demo@flexform.com` / `Demo1234`. See [Authentication (mock)](#authentication-mock).

---

## How it works

### App shell
Most pages share the same shell: a fixed sidebar on desktop, a floating bottom navigation on small screens, a top bar with a user chip, a notification button and a footer. The shared behaviour lives in `common.js`.

### Authentication (mock)
Everything in `auth.js` is **simulated**: it behaves like a real account system but lives entirely in the browser, so it is **not secure**. No email is ever sent, and anyone with dev tools can read or change the data.

**Sign up**
- Name: 2 to 60 characters (letters, spaces, apostrophes, dots, hyphens).
- Email: must look like an email; stored lowercase; must not already belong to a verified account.
- Password: 8 to 64 characters with an uppercase letter, a lowercase letter and a number; a short list of very common passwords is rejected. A strength meter and rule checklist update as you type, and the confirmation must match. Show/Hide buttons reveal the field.
- After sign up, an unverified account is created and a **6-digit code** is "emailed" to the demo inbox on the page. The code expires after 10 minutes, allows 5 wrong attempts, and can be resent after a 30-second cooldown. Refreshing the page resumes verification.
- Passwords are stored as salted PBKDF2-SHA-256 hashes (Web Crypto), never as plain text. If Web Crypto is unavailable a weak fallback hash is used.

**Sign in**
- Needs a verified account. Wrong email and wrong password give the same message ("Incorrect email or password.") so emails can't be probed.
- After 5 failed attempts for an email, sign-in is locked for 30 seconds with a live countdown.
- Signing in to an unverified account sends you back to the verification step with a fresh code.
- **Remember me** keeps you signed in for 30 days. Without it, you stay signed in only in that browser tab (`sessionStorage`); a new tab starts signed out.
- Visiting login or sign up while signed in redirects you away. After login you go to the allow-listed `return` page (or the home page).
- Logging out clears the session and the mirrored user keys, so a guest never sees a previous user's saved data.

**Using it from the rest of the site**
- `common.js` exposes helpers on `window.flexform`: `isLoggedIn`, `getStoredUserName`, `getUserInitials`, `updateAuthUI`, `updateUserLabels`. `isLoggedIn` delegates to `window.flexformAuth` (from `auth.js`).
- Visibility is controlled with CSS classes toggled by `updateAuthUI()`:

  | Class             | Shown when          |
  | ----------------- | ------------------- |
  | `.guest-only`     | logged out          |
  | `.auth-only`      | logged in           |
  | `.protected-link` | logged in           |

- Any element with `data-logout` logs the user out and returns to `index.html`.
- Links to `profile.html` redirect guests to `login.html?return=profile.html`.
- `.user-name-display`, `.user-avatar-text` and `[data-greeting-name]` are filled from the stored name.
- On the profile page, **Edit profile** updates the account's name and email (an email already used by another account is rejected).

### Notifications
`#notificationButton` toggles `#notification` (the `show` class). Handled in `common.js`, so it works on every shell page. Logged-in users see three sample notifications from `notifications-data.js`; guests see "You're all caught up." The panel closes on an outside click or Escape (focus returns to the bell), and the button exposes `aria-expanded`.

### Coach save and book
`trainers.js` keeps two sets of coach names, **saved** and **booked**, and writes them to `localStorage` per user (keyed by email, or `guest`). They survive searching, filtering and reloads. The heart toggles on and off; a booking stays as "✓ Request sent".

### Mock coach chat
Each coach in `trainers-data.js` has:

- `greeting`: the first message, written in that coach's personality (`{user}` is replaced with the user's first name).
- `prompts`: tappable questions, each with a scripted `answer` and `keywords`.
- `fallback`: the reply when a typed message matches no prompt.

Tapping a prompt posts the question and the coach's answer. Typed messages are matched against each prompt's `keywords`. **Nothing is sent anywhere**; replies are scripted and shown after a short delay.

---

## Mock data

All mock data is kept separate from UI logic where practical and is labelled as mock in the source.

| Data                                  | Location            |
| ------------------------------------- | ------------------- |
| Coaches and chat content              | `trainers-data.js`  |
| Courses (10)                          | `courses-data.js`   |
| Lessons for each course               | `lessons-data.js`   |
| Coach bios, sessions, reviews         | `coach-profiles-data.js` |
| Plans                                 | `pricing-data.js`   |
| Planner workout and meal choices      | `planner-data.js`   |
| Today's schedule                      | `index.js`          |
| Workout history                       | `profile.js`        |

Coach names, ratings and availability are made up.

---

## localStorage keys

| Key                                    | Purpose                                                  |
| -------------------------------------- | -------------------------------------------------------- |
| `flexformAccounts`                     | JSON map of email to account (name, salt, password hash, verified flag) |
| `flexformSession`                      | Current session: email, remember flag, expiry            |
| `flexformInbox`                        | Demo-inbox emails (verification codes)                   |
| `flexformVerification`                 | Pending verification codes per email                     |
| `flexformLoginAttempts`                | Failed login counts and lock expiry per email            |
| `flexformLoggedIn`                     | Mirror of the session for the rest of the site (`"true"`) |
| `flexformUserName`                     | Display name                                             |
| `flexformUserEmail`                    | Email (stored lowercase), also used to scope saved/booked data |
| `flexformUsers`                        | JSON map of email to display name (mock user records)    |
| `flexform:<email or guest>:savedCoaches`  | JSON array of saved coach names                       |
| `flexform:<email or guest>:bookedCoaches` | JSON array of coaches with a booking request          |
| `flexform:<email or guest>:courseProgress` | JSON array of started course titles                  |
| `flexform:<email or guest>:weeklyGoal`    | The saved weekly goal (1 to 6)                        |
| `flexform:<email or guest>:planner`       | Planner items by date (`workout`, `meal`, `course`), each with done flag |
| `flexform:<email or guest>:lessonProgress` | Completed lessons per course, with completion date    |
| `flexform:<email or guest>:weightLog`     | Weight entries (one per date)                          |
| `flexform:<email or guest>:plan`          | Chosen plan id (`free`, `plus`, `pro`)                 |
| `flexformTheme`                           | `light` or `dark` if the visitor chose (otherwise the device setting is followed) |
| `flexformSplashSeen` (`sessionStorage`)   | Set once the splash has been shown in this tab         |
| `flexformTabSession` (`sessionStorage`)   | Set while signed in without "remember me"              |
| `flexformPendingEmail` (`sessionStorage`) | Email waiting on verification in this tab              |

All storage access is wrapped so that the site still works if storage is unavailable (for example in a private window), although state will not persist.

---

## Design system

Defined as CSS custom properties in `styles.css`.

| Token       | Value     | Use                    |
| ----------- | --------- | ---------------------- |
| `--ink`     | `#292825` | Text, dark surfaces    |
| `--cream`   | `#f7f3ec` | Page background        |
| `--paper`   | `#fffaf0` | Cards                  |
| `--line`    | `#ded9cd` | Borders                |
| `--stone`   | `#66625a` | Muted text (switches to `#aaa69d` on dark cards) |
| `--coral`   | `#ff665d` | Primary accent         |
| `--coral-text` | `#c9382f` | Small coral text and focus rings (AA contrast on cream) |
| `--sun`     | `#ffd33d` | Highlight accent       |
| `--mint`    | `#b9ddc6` | Success/accent         |
| `--lilac`   | `#d8cce8` | Accent                 |
| `--display` | Space Grotesk | Headings           |
| `--body`    | DM Sans   | Body text              |

Shared pieces (buttons, cards, pills, toast, sidebar, bottom nav, footer) live in `styles.css`. Page-specific styles go in that page's own stylesheet.

---

## Responsive behaviour

Breakpoints in `styles.css`:

- **Above 900px:** fixed sidebar, multi-column grids.
- **900px and below:** sidebar becomes a floating bottom navigation; grids collapse.
- **560px and below:** single-column layouts; the chat panel spans the screen width.

---

## Accessibility

- Semantic HTML, with `lang` set on every page.
- Interactive elements are native `<button>` and `<a>` elements, so they are keyboard-operable. All links, buttons, inputs and selects share a 2px coral `:focus-visible` outline (the darker `--coral-text` on light surfaces, lighter coral on dark ones).
- Chat messages are in an `aria-live` region; the chat close button and heart buttons have `aria-label`s, and hearts expose `aria-pressed`.
- Form controls are wrapped in labels.

A full accessibility audit has not been done. A text-contrast scan found these remaining items: the large coral headline accents (about 2.6:1, brand colour kept), the yellow stat numbers on beige tiles and the cream initials on the yellow avatar on the profile page, and the green "Available" labels on coach cards (about 3.8:1).

---

## Common tasks

**Add a coach**
1. Add an object to the `trainers` array in `trainers-data.js` with `name`, `role`, `specialty`, `initials`, `tone`, `rating`, `tags`, `greeting`, `prompts` and `fallback`.
2. Set `availability` to `"today"` or `"week"`.
3. `specialty` must match one of the filter chips (`Strength`, `Performance`, `Mindful movement`, `Nutrition`) to appear under it.
4. `tone` is one of `coral`, `sun`, `lilac`, `mint`.
5. Update the "N coaches" pill and the initial "N coaches match your search" text in `trainers.html`.

**Add a course**
Add an entry to the `courses` array in `courses.js` as `[title, subtitle, description, progress]`.

**Add a page with the app shell**
1. Copy the sidebar, top bar and bottom nav from an existing page.
2. Load `styles.css`, your own stylesheet, then `common.js`, then your script.
3. Use `.guest-only`, `.auth-only` and `.protected-link` for login-dependent UI.

**Reset local state**
Clear the site's `localStorage` in your browser's dev tools.

---

## Known limitations

- Plans on the pricing page are display-only; nothing is gated by plan.
- Lesson videos are placeholders.
- The headline coral accent words (for example "planner.") have about 2.6:1 contrast on the light theme; this is a pending design decision.

- **Authentication is simulated, not secure.** Accounts, hashes, codes and sessions are all in `localStorage`, and no email is sent. Do not enter real credentials. Anyone using dev tools can read or edit them.
- **Accounts are per browser.** An account created in one browser or profile does not exist in another. People who used the old flag-based login must sign up again (or use the demo account).
- **Changing your email on the profile page does not re-verify it.**
- **No password reset.** There is no "forgot password" flow yet.
- **The `return` parameter on `login.html` is limited to an allow-list** of this site's pages (anything else goes to `index.html`). Keep that restriction if real auth is ever added.
- **No backend.** Booking, chat, goals and course progress are not sent anywhere; they live only in this browser's `localStorage`.
- **Changing your email** on the profile moves your saved and booked coaches, course progress and weekly goal to the new email, but other emails' data is untouched.
- **Mock data is fixed.** Stats, schedule and history are static.
- **Google Fonts** need a network connection.
- **Calorie and BMI figures are rough estimates**, not medical advice.
