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

  document.querySelectorAll('a[href="login.html"], a[href="signup.html"]').forEach((element) => {
    const onAuthPage = ["login.html", "signup.html"].includes(
      window.location.pathname.split("/").pop(),
    );
    element.classList.toggle("hidden", loggedIn && !onAuthPage);
  });
};

window.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    window.location.replace("login.html?return=profile.html");
    return;
  }

  updateAuthUI();
  document.querySelector("#app").classList.remove("hidden");
  document
    .querySelector("#notificationButton")
    ?.addEventListener("click", () =>
      document.querySelector("#notification")?.classList.toggle("show"),
    );

  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    localStorage.removeItem("fitlyLoggedIn");
    window.location.href = "index.html";
  });
});
