const courses = [
  [
    "Start strong",
    "A 14-day foundation",
    "A steady, confidence-building introduction to strength training.",
    60,
  ],
  [
    "The desk reset",
    "Move better in 7 days",
    "Small daily releases for tight shoulders, hips and busy minds.",
    28,
  ],
  [
    "Quiet cardio",
    "Low-impact energy",
    "Get your heart moving without making your living room a gym.",
    0,
  ],
  [
    "Sleep better",
    "A softer evening ritual",
    "A calm sequence to close the day and recover well.",
    0,
  ],
];
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
  document.querySelector("#courseList").innerHTML = courses
    .map(
      ([title, subtitle, description, progress], index) =>
        `<article class="course-card"><small>${subtitle}</small><h3>${title}</h3><p>${description}</p><small class="course-meta">${index + 7} lessons · ${44 + index * 12} min</small><div class="progress"><i style="width:${progress}%"></i></div><button data-course="${title}">${progress ? "Continue course" : "Start course"} →</button></article>`,
    )
    .join("");
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-course]");
    if (!button) return;
    const courseButton = button
      .closest("article")
      ?.querySelector("button[data-course]");
    if (courseButton) {
      courseButton.textContent = "✓ Progress saved";
      courseButton.style.background = "var(--coral)";
    }

    if (event.target.closest("[data-logout]")) {
      localStorage.removeItem("fitlyLoggedIn");
      window.location.href = "index.html";
      return;
    }

    const toast = document.querySelector("#toast");
    if (toast) {
      toast.textContent =
        "Nice work. Your course progress is saved for this visit.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2600);
    }
  });
});
