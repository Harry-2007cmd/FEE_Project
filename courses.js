/* Courses list page. Catalogue lives in courses-data.js (mock data). */
const showToast = (message) => {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
};

const courseCardHtml = (course) => {
  const started = window.flexformCourses.isStarted(course.title);
  const label = started ? "✓ Progress saved" : course.progress ? "Continue course →" : "Start course →";
  return `<article class="course-card">
      <small>${course.subtitle}</small>
      <h3><a href="course.html?id=${course.id}">${course.title}</a></h3>
      <p>${course.description}</p>
      <small class="course-meta">${course.level} · ${course.lessons} lessons · ${course.minutes} min · ${window.flexformCourses.formatPrice(course.price)}</small>
      <div class="progress"><i style="width:${course.progress}%"></i></div>
      <div class="course-actions">
        <button data-course="${course.title}"${started ? ' style="background:var(--coral)"' : ""}>${label}</button>
        <a class="course-details-link" href="course.html?id=${course.id}" aria-label="View details for ${course.title}">Details →</a>
      </div>
    </article>`;
};

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#app").classList.remove("hidden");
  document.querySelector("#courseList").innerHTML = courses.map(courseCardHtml).join("");

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
    button.textContent = "✓ Progress saved";
    button.style.background = "var(--coral)";
    window.flexformCourses.start(button.dataset.course);
    showToast("Nice work. Your course progress is saved.");
  });
});
