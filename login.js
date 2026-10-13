window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#app").classList.remove("hidden");
  const form = document.querySelector("[data-auth]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput = form.querySelector('input[name="email"]');
    const userEmail = window.flexformUsers.normaliseEmail(emailInput?.value);
    if (!userEmail) return;

    // Restore the name remembered for this email (or derive one from it),
    // so a previous user's name is never carried over.
    localStorage.setItem("flexformUserEmail", userEmail);
    localStorage.setItem("flexformUserName", window.flexformUsers.getName(userEmail));

    localStorage.setItem("flexformLoggedIn", "true");
    // Only same-site pages are allowed as a return target.
    const allowedPages = ["index.html", "trainers.html", "courses.html", "tools.html", "profile.html"];
    const requested = new URLSearchParams(window.location.search).get("return");
    window.location.href = allowedPages.includes(requested) ? requested : "index.html";
  });
});
