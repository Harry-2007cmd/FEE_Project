/*
 * Theme (light / dark). Loaded in <head> of every page so the right theme is applied before first paint.
 * - A saved choice ("light" or "dark" in localStorage "flexformTheme") wins.
 * - Otherwise the device setting (prefers-color-scheme) is followed, live.
 * Exposes window.flexformTheme for the header toggle button (see common.js).
 */
(() => {
  const KEY = "flexformTheme";
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  const saved = () => {
    try {
      const value = localStorage.getItem(KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  };
  const current = () => saved() || (media && media.matches ? "dark" : "light");
  const apply = () => {
    document.documentElement.setAttribute("data-theme", current());
    document.dispatchEvent(new CustomEvent("flexform:themechange", { detail: current() }));
  };

  apply();
  if (media) {
    const onChange = () => {
      if (!saved()) apply();
    };
    media.addEventListener ? media.addEventListener("change", onChange) : media.addListener(onChange);
  }

  window.flexformTheme = {
    current,
    set(value) {
      try {
        localStorage.setItem(KEY, value);
      } catch {
        /* storage unavailable: the choice just lasts until the page closes */
      }
      document.documentElement.setAttribute("data-theme", value);
      document.dispatchEvent(new CustomEvent("flexform:themechange", { detail: value }));
    },
    toggle() {
      this.set(current() === "dark" ? "light" : "dark");
    },
  };
})();
