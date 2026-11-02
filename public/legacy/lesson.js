/* Lesson player. URL: lesson.html?course=<id>&n=<lesson number>. Data: courses-data.js, lessons-data.js (mock). The "video" is a placeholder. */
const activity = window.flexformActivity;
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const notify = (message) => {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
};

const lessonUrl = (course, number) => `lesson.html?course=${encodeURIComponent(course.id)}&n=${number}`;

const renderNotFound = (message) => `
  <div class="detail-empty">
    <h1>${message}</h1>
    <p>The link may be incorrect.</p>
    <a class="dark-button" href="courses.html">Browse all courses</a>
  </div>`;

const renderLocked = (course) => `
  <div class="detail-empty">
    <h1>Enrol to watch ${escapeHtml(course.title)}</h1>
    <p>Lessons open once you’ve enrolled. It’s a demo, so no payment is taken.</p>
    <button type="button" class="dark-button" id="enrolHere">Enrol${course.price ? ` — $${course.price}` : " for free"}</button>
    <p><a class="side-cta" href="course.html?id=${escapeHtml(course.id)}">View course details →</a></p>
  </div>`;

const renderLesson = (course, lessons, lesson) => {
  const done = new Set(activity.completedLessons(course.id));
  const percent = Math.round((done.size / lessons.length) * 100);
  const isDone = done.has(lesson.number);
  const previous = lessons[lesson.number - 2];
  const next = lessons[lesson.number];
  return `
    <div class="lesson-layout">
      <div class="lesson-main">
        <div class="video-placeholder" role="img" aria-label="Video placeholder for ${escapeHtml(lesson.title)}">
          <span class="play-mark" aria-hidden="true">▶</span>
          <small>Demo lesson · ${lesson.minutes} min · video not included</small>
        </div>
        <p class="eyebrow">${escapeHtml(course.title)} · Lesson ${lesson.number} of ${lessons.length}</p>
        <h1>${escapeHtml(lesson.title)}</h1>
        <p class="lede">${escapeHtml(lesson.summary)}</p>
        <div class="lesson-actions">
          <button type="button" class="enrol-button lesson-complete${isDone ? " is-done" : ""}" id="completeButton" aria-pressed="${isDone}">${isDone ? "✓ Completed — undo" : "Mark lesson complete"}</button>
        </div>
        <nav class="lesson-pager" aria-label="Lesson navigation">
          ${previous ? `<a href="${lessonUrl(course, previous.number)}">← ${escapeHtml(previous.title)}</a>` : "<span></span>"}
          ${next ? `<a href="${lessonUrl(course, next.number)}">${escapeHtml(next.title)} →</a>` : `<a href="course.html?id=${escapeHtml(course.id)}">Back to course →</a>`}
        </nav>
      </div>
      <aside class="lesson-side" aria-labelledby="listHeading">
        <h2 id="listHeading">Lessons</h2>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" aria-label="Course progress"><i style="width:${percent}%"></i></div>
        <p class="lesson-count" id="progressText">${done.size} of ${lessons.length} complete · ${percent}%</p>
        <ol class="lesson-list">${lessons
          .map(
            (item) => `<li class="${item.number === lesson.number ? "current" : ""}${done.has(item.number) ? " is-done" : ""}">
              <a href="${lessonUrl(course, item.number)}"${item.number === lesson.number ? ' aria-current="page"' : ""}>
                <span class="lesson-mark" aria-hidden="true">${done.has(item.number) ? "✓" : item.number}</span>
                <span class="lesson-name">${escapeHtml(item.title)}</span>
                <small>${item.minutes} min</small>
                <span class="sr-only">${done.has(item.number) ? "Completed" : "Not completed"}</span>
              </a></li>`,
          )
          .join("")}</ol>
      </aside>
    </div>`;
};

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#app").classList.remove("hidden");
  const container = document.querySelector("#lessonView");
  const params = new URLSearchParams(window.location.search);
  const course = courses.find((item) => item.id === params.get("course"));
  const backLink = document.querySelector("#backToCourse");

  if (!course) {
    document.title = "Lesson not found · flexform.";
    backLink.href = "courses.html";
    backLink.textContent = "← All courses";
    container.innerHTML = renderNotFound("We couldn’t find that course.");
    return;
  }
  backLink.href = `course.html?id=${course.id}`;
  backLink.textContent = `← ${course.title}`;

  const lessons = lessonsFor(course);
  const raw = params.get("n");
  const number = /^\d+$/.test(raw || "") ? Number(raw) : 1;
  const lesson = lessons[number - 1];
  if (!lesson) {
    document.title = "Lesson not found · flexform.";
    container.innerHTML = renderNotFound("We couldn’t find that lesson.");
    return;
  }
  document.title = `${lesson.title} · ${course.title} · flexform.`;

  if (!window.flexformCourses.isStarted(course.title)) {
    container.innerHTML = renderLocked(course);
    document.querySelector("#enrolHere").addEventListener("click", () => {
      window.flexformCourses.start(course.title);
      notify(`You’re enrolled in ${course.title}. (Demo — no payment taken.)`);
      draw();
    });
    return;
  }
  draw();

  function draw() {
    container.innerHTML = renderLesson(course, lessons, lesson);
    document.querySelector("#completeButton").addEventListener("click", () => {
      const nowDone = !activity.isLessonDone(course.id, lesson.number);
      activity.setLessonDone(course.id, lesson.number, nowDone);
      draw();
      document.querySelector("#completeButton").focus();
      const all = activity.completedLessons(course.id).length === lessons.length;
      notify(nowDone ? (all ? `You finished ${course.title}. Well done!` : "Lesson complete. Nice work.") : "Marked as not complete.");
    });
  }
});
