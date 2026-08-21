window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#app").classList.remove("hidden");
  const form = document.querySelector("[data-auth]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem("fitlyLoggedIn", "true");
    const returnPage =
      new URLSearchParams(window.location.search).get("return") || "index.html";
    window.location.href = returnPage;
  });
});
