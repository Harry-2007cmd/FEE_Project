/*
 * Per-user "started / enrolled" courses (mock, frontend-only).
 * Stored in localStorage under the user's own key, keyed by course title.
 */
window.flexformCourses = (() => {
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
  return {
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
})();
