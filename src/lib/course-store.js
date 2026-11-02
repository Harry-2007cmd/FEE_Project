/*
 * course-store.js — Per-user "started / enrolled" courses (mock, frontend-only).
 * Stored in localStorage under the user's own key, keyed by course title.
 * Ported from the original global-script version to an ES module.
 */
const key = () => window.flexform.userKey("courseProgress");
const load = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(key()) || "[]"));
  } catch {
    return new Set();
  }
};
const save = (set) => {
  try {
    localStorage.setItem(key(), JSON.stringify([...set]));
  } catch {
    /* storage unavailable: progress just won't persist */
  }
};

export const flexformCourses = {
  isStarted: (title) => load().has(title),
  start(title) {
    const set = load();
    set.add(title);
    save(set);
  },
  leave(title) {
    const set = load();
    set.delete(title);
    save(set);
  },
  formatPrice: (price) => (price ? `$${price}` : "Free"),
};

window.flexformCourses = flexformCourses;
export default flexformCourses;