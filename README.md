# flexform.

A warm, editorial wellness and coaching website. Browse coaches, try short courses, use simple health tools and keep a personal profile.

> **This is a frontend-only project.** There is no backend, database or real authentication. Everything that looks like data (coaches, courses, workout history, schedule) is **mock data** in the JavaScript files, and "login" is a flag in `localStorage`.

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
├── courses.html         Courses
├── tools.html           Body check-in, recommender, weekly goal
├── profile.html         Profile (login required)
├── login.html           Mock sign in
├── signup.html          Mock sign up
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
├── index.js             Home page: guest/member view, schedule, "complete flow"
├── trainers.js          Coach list, search, filters, save/book, mock chat
├── trainers-data.js     MOCK DATA: coaches and their scripted chat content
├── courses.js           Course list and course/free-class interactions
├── tools.js             BMI/calorie estimate, recommender, goal picker
├── profile.js           Profile details and mock workout history
├── login.js             Mock login
└── signup.js            Mock sign up
```

Each page loads `styles.css` first, then its own stylesheet. Pages with the app shell load `common.js` **before** their own script.

| Page          | Stylesheets               | Scripts                                   |
| ------------- | ------------------------- | ----------------------------------------- |
| `index.html`  | `styles.css`, `home.css`  | `common.js`, `index.js`                   |
| `trainers.html` | `styles.css`, `trainers.css` | `common.js`, `trainers-data.js`, `trainers.js` |
| `courses.html` | `styles.css`, `courses.css` | `common.js`, `courses.js`               |
| `tools.html`  | `styles.css`, `tools.css` | `common.js`, `tools.js`                   |
| `profile.html` | `styles.css`, `profile.css` | `common.js`, `profile.js`               |
| `login.html`, `signup.html` | `styles.css`, `auth.css` | `login.js` / `signup.js`        |

---

## Pages

### `load.html` — splash
Shows a loader and redirects to `index.html` after about 1.6 seconds.

### `index.html` — Today
Two views in one page, switched by login state:

- **Guest view:** hero, feature highlights, three coach previews and an FAQ.
- **Member view:** weekly rhythm, today's focus, a "mark flow complete" button, today's schedule, stats, a steps chart and upcoming sessions.

### `trainers.html` — Find a coach
- Search by name or focus, plus filter chips: Strength, Performance, Mindful movement and Nutrition.
- **20 mock coaches** (5 per filter) rendered from `trainers-data.js`.
- **Book a session** and **Save (heart)** on each card. Both persist per user.
- **Chat with…** opens a mock chat panel (see [Mock coach chat](#mock-coach-chat)).
- A "Find my match" banner that selects the Strength filter.

### `courses.html` — Courses
- A free class banner. "Try the free class" starts the *Quiet cardio* course: it scrolls to the card and marks it started.
- Four course cards rendered from an array in `courses.js`, each with a progress bar and a start/continue button.

### `tools.html` — Tools
- **Body check-in:** BMI and a daily energy estimate from height, weight, age and sex (Mifflin-St Jeor: +5 male, −161 female).
- **What suits you?** A rule-based recommender from lifestyle and free time.
- **Weekly goal:** pick 1 to 6 movement moments.

### `profile.html` — Profile
Protected page. Shows name, initials, email, stats, workout history and upcoming bookings. If you are not logged in it redirects to `login.html?return=profile.html`.

### `login.html` / `signup.html`
Mock forms. Any input is accepted. See [Authentication (mock)](#authentication-mock).

---

## How it works

### App shell
Most pages share the same shell: a fixed sidebar on desktop, a floating bottom navigation on small screens, a top bar with a user chip, a notification button and a footer. The shared behaviour lives in `common.js`.

### Authentication (mock)
- "Logged in" is `localStorage.flexformLoggedIn === "true"`. There is no session, token or server check.
- `common.js` exposes helpers on `window.flexform`: `isLoggedIn`, `getStoredUserName`, `getUserInitials`, `updateAuthUI`, `updateUserLabels`.
- Visibility is controlled with CSS classes toggled by `updateAuthUI()`:

  | Class             | Shown when          |
  | ----------------- | ------------------- |
  | `.guest-only`     | logged out          |
  | `.auth-only`      | logged in           |
  | `.protected-link` | logged in           |

- Any element with `data-logout` logs the user out and returns to `index.html`.
- Links to `profile.html` redirect guests to `login.html?return=profile.html`. After login the user returns to the `return` page.
- `.user-name-display`, `.user-avatar-text` and `[data-greeting-name]` are filled from the stored name.

### Notifications
`#notificationButton` toggles `#notification` (the `show` class). Handled in `common.js`, so it works on every shell page.

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
| Courses                               | `courses.js`        |
| Today's schedule                      | `index.js`          |
| Workout history                       | `profile.js`        |

Coach names, ratings and availability are made up.

---

## localStorage keys

| Key                                    | Purpose                                                  |
| -------------------------------------- | -------------------------------------------------------- |
| `flexformLoggedIn`                     | `"true"` when logged in                                  |
| `flexformUserName`                     | Display name                                             |
| `flexformUserEmail`                    | Email, also used to scope saved/booked data              |
| `flexform:<email or guest>:savedCoaches`  | JSON array of saved coach names                       |
| `flexform:<email or guest>:bookedCoaches` | JSON array of coaches with a booking request          |
| `flexformEntrySeen`, `flexformLoaderSeen` | Set by the splash screen                              |

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
| `--stone`   | `#8b877e` | Muted text             |
| `--coral`   | `#ff665d` | Primary accent         |
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
- Interactive elements are native `<button>` and `<a>` elements, so they are keyboard-operable. Custom focus styles exist only for the chat prompt chips; other controls use the browser default focus ring.
- Chat messages are in an `aria-live` region; the chat close button and heart buttons have `aria-label`s, and hearts expose `aria-pressed`.
- Form controls are wrapped in labels.

A full accessibility audit has not been done yet. Adding consistent `:focus-visible` styles is a good next step.

---

## Common tasks

**Add a coach**
1. Add an object to the `trainers` array in `trainers-data.js` with `name`, `role`, `specialty`, `initials`, `tone`, `rating`, `tags`, `greeting`, `prompts` and `fallback`.
2. `specialty` must match one of the filter chips (`Strength`, `Performance`, `Mindful movement`, `Nutrition`) to appear under it.
3. `tone` is one of `coral`, `sun`, `lilac`, `mint`.
4. Update the "N coaches" pill and the initial "N coaches match your search" text in `trainers.html`.

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

- **No real authentication.** Any email and password logs you in. Do not enter real credentials.
- **The `return` parameter on `login.html` is not validated.** It is fine for a local mock, but must be restricted to same-site paths if real auth is ever added.
- **No backend.** Booking, chat, goals and course progress are not sent anywhere. Course progress and the weekly goal are not remembered after a reload.
- **Mock data is fixed.** Stats, schedule and history are static.
- **Google Fonts** need a network connection.
- **Calorie and BMI figures are rough estimates**, not medical advice.
