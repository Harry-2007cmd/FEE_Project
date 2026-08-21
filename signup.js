window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#app").classList.remove("hidden");
  document.querySelector("[data-auth]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem("fitlyLoggedIn", "true");
    window.location.href = "index.html";
  });
});
