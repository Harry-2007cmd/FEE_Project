window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#app").classList.remove("hidden");
  const form = document.querySelector("[data-auth]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const fullName = nameInput?.value.trim();
    const userEmail = window.flexformUsers.normaliseEmail(emailInput?.value);
    if (!fullName || !userEmail) return;

    window.flexformUsers.setName(userEmail, fullName);
    localStorage.setItem("flexformUserName", fullName);
    localStorage.setItem("flexformUserEmail", userEmail);

    localStorage.setItem("flexformLoggedIn", "true");
    window.location.href = "index.html";
  });
});
