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
  updateAuthUI();
  document.querySelector("#app").classList.remove("hidden");
  document.querySelector("#calculate")?.addEventListener("click", () => {
    const height = Number(document.querySelector("#height").value);
    const weight = Number(document.querySelector("#weight").value);
    const age = Number(document.querySelector("#age").value);
    const bmi = weight / Math.pow(height / 100, 2);
    const calories = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    const results = document.querySelector("#results");
    results.classList.remove("hidden");
    results.innerHTML = `<div><small>ESTIMATED BMI</small><b>${bmi.toFixed(1)}</b></div><div><small>DAILY ENERGY GUIDE</small><b>${calories.toLocaleString()}</b></div>`;
  });
  document.querySelectorAll(".goal-buttons button").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".goal-buttons button")
        .forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      document.querySelector("#goalValue").textContent =
        `${button.textContent} moments`;
    }),
  );
  document.querySelector("#saveGoal")?.addEventListener("click", (event) => {
    event.target.textContent = "Weekly goal saved";
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-logout]")) {
      localStorage.removeItem("fitlyLoggedIn");
      window.location.href = "index.html";
    }
  });
});
