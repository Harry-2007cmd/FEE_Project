window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#app").classList.remove("hidden");
  const form = document.querySelector("[data-auth]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput = form.querySelector('input[name="email"]');
    const userEmail = emailInput?.value.trim();
    if (userEmail) {
      localStorage.setItem("flexformUserEmail", userEmail);
    }

    const storedName = localStorage.getItem("flexformUserName");
    if (!storedName) {
      localStorage.setItem("flexformUserName", "Friend");
    }

    localStorage.setItem("fitlyLoggedIn", "true");
    const returnPage =
      new URLSearchParams(window.location.search).get("return") || "index.html";
    window.location.href = returnPage;
  });
});
