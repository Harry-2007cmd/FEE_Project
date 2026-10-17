/*
 * user-store.js — mock per-email user records (frontend-only, localStorage).
 * Remembers the display name for each email so login can restore it.
 * Not real accounts: there is no password check and nothing leaves the browser.
 *
 * Exposes window.flexformUsers. Load before login.js, signup.js and profile.js.
 */
(() => {
  const USERS_KEY = "flexformUsers";

  const normaliseEmail = (email = "") => email.trim().toLowerCase();

  const readUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    } catch {
      return {};
    }
  };

  const writeUsers = (users) => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      /* storage unavailable: the name just won't be remembered */
    }
  };

  /** "sam.rao@mail.com" -> "Sam Rao" */
  const nameFromEmail = (email) =>
    normaliseEmail(email)
      .split("@")[0]
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(" ") || "Friend";

  const getName = (email) =>
    readUsers()[normaliseEmail(email)] || nameFromEmail(email);

  const setName = (email, name) => {
    const users = readUsers();
    users[normaliseEmail(email)] = name.trim();
    writeUsers(users);
  };

  /** Move a user's record (and their saved/booked coaches, courses, planner, lessons, weight log, plan) when their email changes. */
  const renameEmail = (oldEmail, newEmail) => {
    const from = normaliseEmail(oldEmail);
    const to = normaliseEmail(newEmail);
    if (!from || from === to) return;

    const users = readUsers();
    if (users[from] !== undefined && users[to] === undefined) {
      users[to] = users[from];
    }
    delete users[from];
    writeUsers(users);

    ["savedCoaches", "bookedCoaches", "courseProgress", "weeklyGoal", "planner", "lessonProgress", "weightLog", "plan"].forEach((kind) => {
      const oldKey = `flexform:${from}:${kind}`;
      const value = localStorage.getItem(oldKey);
      if (value !== null) {
        localStorage.setItem(`flexform:${to}:${kind}`, value);
        localStorage.removeItem(oldKey);
      }
    });
  };

  window.flexformUsers = { normaliseEmail, getName, setName, renameEmail };
})();
