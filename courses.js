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
/* Started courses are remembered per user in localStorage (mock, frontend-only). */
const loadStartedCourses = () => {
  try {
    return new Set(
      JSON.parse(localStorage.getItem(window.flexform.userKey("courseProgress")) || "[]"),
    );
  } catch {
    return new Set();
  }
};
const storeStartedCourses = (set) => {
  try {
    localStorage.setItem(window.flexform.userKey("courseProgress"), JSON.stringify([...set]));
  } catch {
    /* storage unavailable: progress just won't persist */
  }
};

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#app").classList.remove("hidden");
  const startedCourses = loadStartedCourses();
  document.querySelector("#courseList").innerHTML = courses
    .map(
      ([title, subtitle, description, progress], index) =>
        `<article class="course-card"><small>${subtitle}</small><h3>${title}</h3><p>${description}</p><small class="course-meta">${index + 7} lessons · ${44 + index * 12} min</small><div class="progress"><i style="width:${progress}%"></i></div><button data-course="${title}"${startedCourses.has(title) ? ' style="background:var(--coral)"' : ""}>${startedCourses.has(title) ? "✓ Progress saved" : progress ? "Continue course →" : "Start course →"}</button></article>`,
    )
    .join("");
  document.addEventListener("click", (event) => {
    // The free class banner starts the "Quiet cardio" course.
    if (event.target.closest("[data-free-class]")) {
      const card = [...document.querySelectorAll("#courseList [data-course]")].find(
        (item) => item.dataset.course === "Quiet cardio",
      );
      card?.scrollIntoView({ behavior: "smooth", block: "center" });
      card?.click();
      return;
    }
    const button = event.target.closest("[data-course]");
    if (!button) return;
    const courseButton = button
      .closest("article")
      ?.querySelector("button[data-course]");
    if (courseButton) {
      courseButton.textContent = "✓ Progress saved";
      courseButton.style.background = "var(--coral)";
      startedCourses.add(courseButton.dataset.course);
      storeStartedCourses(startedCourses);
    }

    const toast = document.querySelector("#toast");
    if (toast) {
      toast.textContent =
        "Nice work. Your course progress is saved.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2600);
    }
  });
});
