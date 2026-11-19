/*
 * auth-ui-utils.js — small DOM helpers shared by login.js and signup.js
 * (field errors, show/hide password, busy buttons, safe return page).
 * Ported from the original global-script version to an ES module.
 */
// Accepts the new route paths (/profile) and the legacy file names (profile.html).
const ALLOWED_RETURN_ROUTES = {
  "/": "/", "index.html": "/",
  "/trainers": "/trainers", "trainers.html": "/trainers", "trainers": "/trainers",
  "/courses": "/courses", "courses.html": "/courses", "courses": "/courses",
  "/tools": "/tools", "tools.html": "/tools", "tools": "/tools",
  "/profile": "/profile", "profile.html": "/profile", "profile": "/profile",
  "/planner": "/planner", "planner.html": "/planner", "planner": "/planner",
  "/pricing": "/pricing", "pricing.html": "/pricing", "pricing": "/pricing",
};

/** Only same-site pages are allowed as a post-login destination. */
const returnPage = () => {
  const requested = new URLSearchParams(window.location.search).get("return") || "";
  const [path] = requested.split(/[?#]/);
  const route = ALLOWED_RETURN_ROUTES[path] || ALLOWED_RETURN_ROUTES[path.replace(/^\//, "")];
  return route || "/";
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const setFieldError = (inputId, message) => {
  const input = document.getElementById(inputId);
  const error = document.getElementById(`${inputId}-error`);
  if (!input || !error) return;
  error.textContent = message || "";
  if (message) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");
};

const showFormError = (id, message) => {
  const node = document.getElementById(id);
  if (!node) return;
  node.textContent = message || "";
  node.classList.toggle("hidden", !message);
};

const clearErrors = (form, formErrorId) => {
  form?.querySelectorAll("[aria-invalid]").forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
  form?.querySelectorAll(".field-error").forEach((node) => {
    node.textContent = "";
  });
  if (formErrorId) showFormError(formErrorId, "");
};

/** Disable a submit button and swap its label while "the network" works. */
const setBusy = (button, busy, busyLabel) => {
  if (!button) return;
  if (busy) {
    button.dataset.label = button.textContent;
    button.textContent = busyLabel;
  } else if (button.dataset.label) {
    button.textContent = button.dataset.label;
  }
  button.disabled = busy;
  button.setAttribute("aria-busy", String(busy));
};

const bindPasswordToggles = () => {
  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.getAttribute("aria-controls"));
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.textContent = show ? "Hide" : "Show";
      button.setAttribute("aria-pressed", String(show));
      button.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });
};

export const flexformAuthUI = {
  returnPage,
  delay,
  setFieldError,
  showFormError,
  clearErrors,
  setBusy,
  bindPasswordToggles,
};

window.flexformAuthUI = flexformAuthUI;
export default flexformAuthUI;