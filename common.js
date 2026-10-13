/*
 * common.js — shared behaviour for every page that has the app shell
 * (sidebar, top bar, mobile nav). Load it BEFORE the page's own script.
 *
 * Everything is exposed on window.flexform so it cannot collide with the
 * top-level constants declared in individual page scripts.
 *
 * NOTE: authentication is a frontend-only mock. "Logged in" is just a flag
 * in localStorage; there is no real session or server.
 */
(() => {
  const AUTH_KEY = "fitlyLoggedIn";
  const NAME_KEY = "flexformUserName";
  const DEFAULT_NAME = "Friend";

  const isLoggedIn = () => localStorage.getItem(AUTH_KEY) === "true";

  const getStoredUserName = () =>
    localStorage.getItem(NAME_KEY)?.trim() || DEFAULT_NAME;

  const getUserInitials = (name = getStoredUserName()) =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "F";

  const currentPageName = () =>
    window.location.pathname.split("/").pop() || "index.html";

  /** Show/hide guest-only, auth-only and protected elements. */
  const updateAuthUI = () => {
    const loggedIn = isLoggedIn();
    const page = currentPageName();
    const isProfilePage = page === "profile.html";
    const onAuthPage = ["login.html", "signup.html"].includes(page);

    document.querySelectorAll(".auth-only").forEach((element) => {
      element.classList.toggle("hidden", !loggedIn || isProfilePage);
    });
    document.querySelectorAll(".guest-only").forEach((element) => {
      element.classList.toggle("hidden", loggedIn || isProfilePage);
    });
    document.querySelectorAll(".user-chip--main").forEach((element) => {
      element.classList.toggle("hidden", !loggedIn || isProfilePage);
    });
    document.querySelectorAll(".protected-link").forEach((element) => {
      element.classList.toggle("hidden", !loggedIn);
    });
    document
      .querySelectorAll('a[href="login.html"], a[href="signup.html"]')
      .forEach((element) => {
        element.classList.toggle("hidden", loggedIn && !onAuthPage);
      });

    if (loggedIn) updateUserLabels();
  };

  /** Fill the header user chip (and any greeting) from the stored name. */
  const updateUserLabels = () => {
    const userName = getStoredUserName();
    const initials = getUserInitials(userName);
    const firstName = userName.split(/\s+/)[0] || DEFAULT_NAME;

    document.querySelectorAll(".user-name-display").forEach((element) => {
      element.textContent = userName;
    });
    document.querySelectorAll(".user-avatar-text").forEach((element) => {
      element.textContent = initials;
    });
    document.querySelectorAll("[data-greeting-name]").forEach((element) => {
      element.textContent = `${firstName}.`;
    });
  };

  const bindShellEvents = () => {
    document
      .querySelector("#notificationButton")
      ?.addEventListener("click", () => {
        document.querySelector("#notification")?.classList.toggle("show");
      });

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-logout]")) {
        localStorage.removeItem(AUTH_KEY);
        window.location.href = "index.html";
        return;
      }

      const protectedLink = event.target.closest('a[href="profile.html"]');
      if (protectedLink && !isLoggedIn()) {
        event.preventDefault();
        window.location.href = "login.html?return=profile.html";
      }
    });
  };

  window.flexform = {
    isLoggedIn,
    getStoredUserName,
    getUserInitials,
    updateAuthUI,
    updateUserLabels,
  };

  window.addEventListener("DOMContentLoaded", () => {
    // The profile page redirects guests itself before showing anything.
    if (currentPageName() === "profile.html" && !isLoggedIn()) return;
    updateAuthUI();
    bindShellEvents();
  });
})();
