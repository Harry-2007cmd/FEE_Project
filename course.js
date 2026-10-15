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
  const id = new URLSearchParams(window.location.search).get("id");
  const index = courses.findIndex((item) => item.id === id);
  const course = courses[index];

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

  enrolButton.addEventListener("click", () => {
    window.flexformCourses.start(course.title);
    enrolButton.textContent = "✓ Enrolled";
    enrolButton.disabled = true;
    leaveButton.classList.remove("hidden");
    notify(`You’re enrolled in ${course.title}. (Demo — no payment taken.)`);
  });

  leaveButton.addEventListener("click", () => {
    window.flexformCourses.leave(course.title);
    enrolButton.textContent = enrolLabel(course);
    enrolButton.disabled = false;
    leaveButton.classList.add("hidden");
    enrolButton.focus();
    notify(`You left ${course.title}.`);
  });
});
