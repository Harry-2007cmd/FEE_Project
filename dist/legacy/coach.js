/* Coach profile page. Reads ?id=<slug>. Data: trainers-data.js, coach-profiles-data.js, courses-data.js (all mock). */
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const stars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);
const toneFor = (tone) => ({ coral: "pink", mint: "mint", lilac: "lilac", sun: "sun" })[tone] || "sun";

/* Saved / booked coaches use the same per-user storage as the Find a coach page. */
const loadSet = (kind) => {
  try {
    return new Set(JSON.parse(localStorage.getItem(window.flexform.userKey(kind)) || "[]"));
  } catch {
    return new Set();
  }
};
const storeSet = (kind, set) => {
  try {
    localStorage.setItem(window.flexform.userKey(kind), JSON.stringify([...set]));
  } catch {
    /* storage unavailable: state just won't persist */
  }
};

const notify = (message) => {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
};

const renderCoach = (coach, profile) => {
  const saved = loadSet("savedCoaches").has(coach.name);
  const booked = loadSet("bookedCoaches").has(coach.name);
  const first = coach.name.split(" ")[0];
  const average = profile.reviews.reduce((sum, r) => sum + r.rating, 0) / profile.reviews.length;
  const taught = courses.filter((course) => course.trainers.includes(coach.name));
  return `
    <header class="detail-hero" data-tone="${toneFor(coach.tone)}">
      <div>
        <p class="eyebrow">${escapeHtml(coach.specialty)}</p>
        <h1>${escapeHtml(coach.name)}</h1>
        <p class="lede">${escapeHtml(coach.role)}</p>
        <ul class="detail-chips" aria-label="Coach facts">
          <li>${profile.years} years coaching</li>
          <li><span aria-hidden="true">★</span> ${coach.rating} rating</li>
          <li>${coach.availability === "today" ? "Available today" : "Available this week"}</li>
          ${coach.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}
        </ul>
      </div>
      <aside class="enrol-card" aria-label="Book ${escapeHtml(first)}">
        <span class="detail-avatar coach-avatar" data-tone="${escapeHtml(coach.tone)}" aria-hidden="true">${escapeHtml(coach.initials)}</span>
        <button type="button" class="enrol-button" id="bookButton"${booked ? " disabled" : ""}>${booked ? "✓ Request sent" : "Book a session"}</button>
        <a class="coach-chat-link" href="trainers.html?chat=${encodeURIComponent(coach.name)}">Chat with ${escapeHtml(first)}</a>
        <button type="button" class="link-button" id="saveButton" aria-pressed="${saved}">${saved ? "♥ Saved" : "♡ Save coach"}</button>
        <p class="enrol-note">Demo only — no real booking is made.</p>
      </aside>
    </header>

    <div class="detail-grid">
      <div class="detail-main">
        <section class="detail-section" aria-labelledby="aboutHeading">
          <h2 id="aboutHeading">About ${escapeHtml(first)}</h2>
          <p class="coach-text">${escapeHtml(profile.bio)}</p>
          <h3 class="coach-sub">Approach</h3>
          <p class="coach-text">${escapeHtml(profile.approach)}</p>
        </section>

        <section class="detail-section" aria-labelledby="sessionsHeading">
          <h2 id="sessionsHeading">Sessions</h2>
          <ul class="session-list">${profile.sessions
            .map((s) => `<li><b>${escapeHtml(s.title)}</b><span>${s.minutes} min</span></li>`)
            .join("")}</ul>
        </section>

        <section class="detail-section" aria-labelledby="reviewsHeading">
          <h2 id="reviewsHeading">Reviews</h2>
          <p class="sample-note">Sample reviews for this demo · average ${average.toFixed(1)} from ${profile.reviews.length}</p>
          <ul class="review-list">${profile.reviews
            .map(
              (r) => `<li class="review"><div class="review-head"><b>${escapeHtml(r.name)}</b><span class="stars" role="img" aria-label="${r.rating} out of 5 stars">${stars(r.rating)}</span></div><p>${escapeHtml(r.text)}</p></li>`,
            )
            .join("")}</ul>
        </section>
      </div>

      <div class="detail-side">
        <section class="detail-section" aria-labelledby="coursesHeading">
          <h2 id="coursesHeading">Courses with ${escapeHtml(first)}</h2>
          ${
            taught.length
              ? `<ul class="coach-courses">${taught
                  .map(
                    (c) => `<li><a href="course.html?id=${escapeHtml(c.id)}"><b>${escapeHtml(c.title)}</b><small>${escapeHtml(c.level)} · ${window.flexformCourses.formatPrice(c.price)}</small></a></li>`,
                  )
                  .join("")}</ul>`
              : `<p class="coach-text">${escapeHtml(first)} isn’t part of a course yet.</p>`
          }
        </section>

        <section class="detail-section" aria-labelledby="credHeading">
          <h2 id="credHeading">Credentials</h2>
          <ul class="learn-list">${profile.credentials.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>
      </div>
    </div>`;
};

const renderNotFound = () => `
  <div class="detail-empty">
    <h1>We couldn’t find that coach.</h1>
    <p>They may have moved on or the link is incorrect.</p>
    <a class="dark-button" href="trainers.html">Browse all coaches</a>
  </div>`;

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#app").classList.remove("hidden");
  const container = document.querySelector("#coachDetail");
  container.innerHTML = '<div class="detail-empty" role="status"><h1>Loading coach…</h1></div>';

  // The coaches and the courses they teach are loaded together; the page draws once both Promises resolve.
  Promise.all([window.flexformApi.getCoaches(), window.flexformApi.getCourses()])
    .then(([coachList]) => {
      const id = new URLSearchParams(window.location.search).get("id");
      const coach = coachList.find((item) => coachSlug(item.name) === id);
      const profile = coach && coachProfiles[coach.name];

      if (!coach || !profile) {
        document.title = "Coach not found · flexform.";
        container.innerHTML = renderNotFound();
        return;
      }

      document.title = `${coach.name} · flexform.`;
      container.innerHTML = renderCoach(coach, profile);

      document.querySelector("#bookButton").addEventListener("click", (event) => {
        const booked = loadSet("bookedCoaches");
        booked.add(coach.name);
        storeSet("bookedCoaches", booked);
        event.currentTarget.textContent = "✓ Request sent";
        event.currentTarget.disabled = true;
        notify(`Request sent to ${coach.name}. (Demo — nothing is booked.)`);
      });

      document.querySelector("#saveButton").addEventListener("click", (event) => {
        const savedSet = loadSet("savedCoaches");
        const nowSaved = !savedSet.has(coach.name);
        if (nowSaved) savedSet.add(coach.name);
        else savedSet.delete(coach.name);
        storeSet("savedCoaches", savedSet);
        event.currentTarget.textContent = nowSaved ? "♥ Saved" : "♡ Save coach";
        event.currentTarget.setAttribute("aria-pressed", String(nowSaved));
        notify(nowSaved ? `${coach.name} saved.` : `${coach.name} removed from saved coaches.`);
      });
    })
    .catch((error) => {
      container.innerHTML = `<div class="detail-empty" role="alert"><h1>${error.message}</h1><a class="dark-button" href="">Try again</a></div>`;
    });
});
