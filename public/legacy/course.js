/* Course detail page. Reads ?id=<slug>; data comes from courses-data.js and trainers-data.js (mock). */
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const stars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);

const toneFor = (index) => ["sun", "lilac", "mint", "pink"][index % 4];

const renderTrainer = (name) => {
  const coach = trainers.find((item) => item.name === name);
  if (!coach) return "";
  return `<li class="detail-trainer">
      <span class="detail-avatar" data-tone="${coach.tone}" aria-hidden="true">${escapeHtml(coach.initials)}</span>
      <div><b>${escapeHtml(coach.name)}</b><small>${escapeHtml(coach.role)}</small></div>
    </li>`;
};


const activity = window.flexformActivity;

const lessonUrl = (course, number) => `lesson.html?course=${encodeURIComponent(course.id)}&n=${number}`;

/** Progress summary + "continue" link in the enrol card (only when enrolled). */
const progressBlockHtml = (course) => {
  if (!window.flexformCourses.isStarted(course.title)) return "";
  const lessons = lessonsFor(course);
  const done = new Set(activity.completedLessons(course.id));
  const percent = Math.round((done.size / lessons.length) * 100);
  const next = lessons.find((lesson) => !done.has(lesson.number));
  return `<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" aria-label="Course progress"><i style="width:${percent}%"></i></div>
    <p class="enrol-progress">${done.size} of ${lessons.length} lessons · ${percent}%</p>
    <a class="enrol-link" href="${next ? lessonUrl(course, next.number) : lessonUrl(course, 1)}">${done.size === 0 ? "Start lessons" : next ? "Continue lessons" : "Review lessons"} →</a>`;
};

/** Lesson list; links only work once enrolled. */
const lessonsBlockHtml = (course) => {
  const enrolled = window.flexformCourses.isStarted(course.title);
  const done = new Set(activity.completedLessons(course.id));
  return `<ol class="syllabus">${lessonsFor(course)
    .map((lesson) => {
      const label = `<span class="lesson-mark${done.has(lesson.number) ? " done" : ""}" aria-hidden="true">${done.has(lesson.number) ? "✓" : enrolled ? lesson.number : "🔒"}</span><span class="syllabus-title">${escapeHtml(lesson.title)}</span><small>${lesson.minutes} min</small>${done.has(lesson.number) ? '<span class="sr-only">Completed</span>' : ""}`;
      return `<li>${enrolled ? `<a href="${lessonUrl(course, lesson.number)}">${label}</a>` : `<div class="syllabus-locked">${label}</div>`}</li>`;
    })
    .join("")}</ol>${enrolled ? "" : '<p class="sample-note">Enrol to unlock the lessons.</p>'}`;
};

const enrolLabel = (course) => (course.price ? `Enrol — $${course.price}` : "Start for free");

const renderCourse = (course, index) => {
  const store = window.flexformCourses;
  const enrolled = store.isStarted(course.title);
  const reviewCount = course.reviews.length;
  return `
    <header class="detail-hero" data-tone="${toneFor(index)}">
      <div>
        <p class="eyebrow">${escapeHtml(course.subtitle)}</p>
        <h1>${escapeHtml(course.title)}</h1>
        <p class="lede">${escapeHtml(course.description)}</p>
        <ul class="detail-chips" aria-label="Course facts">
          <li>${escapeHtml(course.level)}</li>
          <li>${course.weeks} ${course.weeks === 1 ? "week" : "weeks"}</li>
          <li>${course.lessons} lessons</li>
          <li>${course.minutes} min total</li>
          <li><span aria-hidden="true">★</span> ${course.rating} (${reviewCount} reviews)</li>
        </ul>
      </div>
      <aside class="enrol-card" aria-label="Enrol">
        <p class="price">${store.formatPrice(course.price)}</p>
        <button type="button" class="enrol-button" id="enrolButton"${enrolled ? " disabled" : ""}>${enrolled ? "✓ Enrolled" : enrolLabel(course)}</button>
        <button type="button" class="link-button${enrolled ? "" : " hidden"}" id="leaveButton">Leave course</button>
        <div id="courseProgress">${progressBlockHtml(course)}</div>
        <p class="enrol-note">Demo only — no payment is taken.</p>
      </aside>
    </header>

    <div class="detail-grid">
      <div class="detail-main">
        <section class="detail-section" aria-labelledby="learnHeading">
          <h2 id="learnHeading">What you’ll learn</h2>
          <ul class="learn-list">${course.learn.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>

        <section class="detail-section" aria-labelledby="timelineHeading">
          <h2 id="timelineHeading">Timeline</h2>
          <ol class="timeline">${course.timeline
            .map(
              (step) => `<li><small>${escapeHtml(step.when)}</small><b>${escapeHtml(step.title)}</b><p>${escapeHtml(step.detail)}</p></li>`,
            )
            .join("")}</ol>
        </section>

        <section class="detail-section" aria-labelledby="lessonsHeading">
          <h2 id="lessonsHeading">Lessons</h2>
          <div id="lessonsBlock">${lessonsBlockHtml(course)}</div>
        </section>

        <section class="detail-section" aria-labelledby="reviewsHeading">
          <h2 id="reviewsHeading">Reviews</h2>
          <p class="sample-note">Sample reviews for this demo.</p>
          <ul class="review-list">${course.reviews
            .map(
              (review) => `<li class="review"><div class="review-head"><b>${escapeHtml(review.name)}</b><span class="stars" role="img" aria-label="${review.rating} out of 5 stars">${stars(review.rating)}</span></div><p>${escapeHtml(review.text)}</p></li>`,
            )
            .join("")}</ul>
        </section>
      </div>

      <div class="detail-side">
        <section class="detail-section" aria-labelledby="trainersHeading">
          <h2 id="trainersHeading">Trainers involved</h2>
          <ul class="detail-trainers">${course.trainers.map(renderTrainer).join("")}</ul>
          <a class="side-cta" href="trainers.html">Meet all coaches →</a>
        </section>

        <section class="detail-section" aria-labelledby="goodHeading">
          <h2 id="goodHeading">Good to know</h2>
          <dl class="good-list">
            <dt>Who it’s for</dt><dd>${escapeHtml(course.forWho)}</dd>
            <dt>What you need</dt><dd>${escapeHtml(course.equipment)}</dd>
            <dt>Format</dt><dd>${escapeHtml(course.format)}</dd>
          </dl>
        </section>
      </div>
    </div>`;
};

const renderNotFound = () => `
  <div class="detail-empty">
    <h1>We couldn’t find that course.</h1>
    <p>It may have been moved or the link is incorrect.</p>
    <a class="dark-button" href="courses.html">Browse all courses</a>
  </div>`;

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#app").classList.remove("hidden");
  const container = document.querySelector("#courseDetail");
  container.innerHTML = '<div class="detail-empty" role="status"><h1>Loading course…</h1></div>';

  // The course list and the coaches are loaded together; the page draws once both Promises resolve.
  Promise.all([window.flexformApi.getCourses(), window.flexformApi.getCoaches()])
    .then(([courseList]) => {
      const id = new URLSearchParams(window.location.search).get("id");
      const index = courseList.findIndex((item) => item.id === id);
      const course = courseList[index];

      if (!course) {
        document.title = "Course not found · flexform.";
        container.innerHTML = renderNotFound();
        return;
      }

      document.title = `${course.title} · flexform.`;
      container.innerHTML = renderCourse(course, index);

      const enrolButton = document.querySelector("#enrolButton");
      const leaveButton = document.querySelector("#leaveButton");
      const toast = document.querySelector("#toast");
      const notify = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2600);
      };

      const refreshLessons = () => {
        document.querySelector("#courseProgress").innerHTML = progressBlockHtml(course);
        document.querySelector("#lessonsBlock").innerHTML = lessonsBlockHtml(course);
      };

      enrolButton.addEventListener("click", () => {
        window.flexformCourses.start(course.title);
        enrolButton.textContent = "✓ Enrolled";
        enrolButton.disabled = true;
        leaveButton.classList.remove("hidden");
        refreshLessons();
        notify(`You’re enrolled in ${course.title}. (Demo — no payment taken.)`);
      });

      leaveButton.addEventListener("click", () => {
        window.flexformCourses.leave(course.title);
        enrolButton.textContent = enrolLabel(course);
        enrolButton.disabled = false;
        leaveButton.classList.add("hidden");
        refreshLessons();
        enrolButton.focus();
        notify(`You left ${course.title}.`);
      });
    })
    .catch((error) => {
      container.innerHTML = `<div class="detail-empty" role="alert"><h1>${error.message}</h1><a class="dark-button" href="">Try again</a></div>`;
    });
});
