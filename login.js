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
    const returnPage =
      new URLSearchParams(window.location.search).get("return") || "index.html";
    window.location.href = returnPage;
  });
});
