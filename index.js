const select = (selector) => document.querySelector(selector);
const isLoggedIn = () => localStorage.getItem("fitlyLoggedIn") === "true";

const updateAuthUI = () => {
  const loggedIn = isLoggedIn();

  const isProfilePage = window.location.pathname.endsWith("profile.html");

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

  document.querySelectorAll('a[href="login.html"], a[href="signup.html"]').forEach((element) => {
    const onAuthPage = ["login.html", "signup.html"].includes(
      window.location.pathname.split("/").pop(),
    );
    element.classList.toggle("hidden", loggedIn && !onAuthPage);
  });

  const isHomePage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/");
  const guestHome = document.getElementById("page-home-guest");
  const memberHome = document.getElementById("page-home-member");

  if (isHomePage) {
    guestHome?.classList.toggle("hidden", loggedIn);
    memberHome?.classList.toggle("hidden", !loggedIn);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const hasSeenEntry = localStorage.getItem("flexformEntrySeen") === "true";

  if (!hasSeenEntry && (window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/"))) {
    window.location.href = "load.html";
    return;
  }

  updateAuthUI();
  select("#notificationButton")?.addEventListener("click", () => {
    select("#notification")?.classList.toggle("show");
  });

  document.addEventListener("click", (event) => {
    const protectedLink = event.target.closest('a[href="profile.html"]');
    if (protectedLink && !isLoggedIn()) {
      event.preventDefault();
      window.location.href = "login.html?return=profile.html";
      return;
    }

    if (event.target.closest("[data-logout]")) {
      localStorage.removeItem("fitlyLoggedIn");
      window.location.href = "index.html";
      return;
    }

    const completeButton = event.target.closest("[data-complete]");
    if (completeButton) {
      completeButton.innerHTML = "Flow marked complete ✓";
      const toast = select("#toast");
      if (toast) {
        toast.textContent = "Your flow is complete. That counts.";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2600);
      }
    }
  });
});
