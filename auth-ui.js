/*
 * auth-ui.js — small DOM helpers shared by login.js and signup.js
 * (field errors, show/hide password, busy buttons, safe return page).
 * Exposes window.flexformAuthUI. Load after auth.js.
 */
(() => {
  const ALLOWED_RETURN_PAGES = [
    "index.html",
    "trainers.html",
    "courses.html",
    "tools.html",
    "profile.html",
    "planner.html",
    "pricing.html",
  ];

  /** Only same-site pages are allowed as a post-login destination. */
  const returnPage = () => {
    const requested = new URLSearchParams(window.location.search).get("return");
    return ALLOWED_RETURN_PAGES.includes(requested) ? requested : "index.html";
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
    form.querySelectorAll("[aria-invalid]").forEach((input) => {
      input.removeAttribute("aria-invalid");
    });
    form.querySelectorAll(".field-error").forEach((node) => {
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

  window.flexformAuthUI = {
    returnPage,
    delay,
    setFieldError,
    showFormError,
    clearErrors,
    setBusy,
    bindPasswordToggles,
  };
})();
