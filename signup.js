window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#app").classList.remove("hidden");
  const form = document.querySelector("[data-auth]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const fullName = nameInput?.value.trim();
    const userEmail = emailInput?.value.trim();

    if (fullName) {
      localStorage.setItem("flexformUserName", fullName);
    }
    if (userEmail) {
      localStorage.setItem("flexformUserEmail", userEmail);
    }

    localStorage.setItem("fitlyLoggedIn", "true");
    window.location.href = "index.html";
  });
});
