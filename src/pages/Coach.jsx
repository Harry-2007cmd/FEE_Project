import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/styles.css";
import "../styles/courses.css";
import "../styles/course-detail.css";
import "../styles/coach.css";
import { escapeHtml } from "../lib/utils.js";

const stars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);
const toneFor = (tone) => ({ coral: "pink", mint: "mint", lilac: "lilac", sun: "sun" })[tone] || "sun";

const userKey = (kind) => `flexform:${localStorage.getItem("flexformUserEmail") || "guest"}:${kind}`;
const loadSet = (kind) => {
  try {
    return new Set(JSON.parse(localStorage.getItem(userKey(kind)) || "[]"));
  } catch {
    return new Set();
  }
};
const storeSet = (kind, set) => {
  try {
    localStorage.setItem(userKey(kind), JSON.stringify([...set]));
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

export default function Coach() {
  const [searchParams] = useSearchParams();
  const [coach, setCoach] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const renderCoach = (coach, profile) => {
    const saved = loadSet("savedCoaches").has(coach.name);
    const booked = loadSet("bookedCoaches").has(coach.name);
    const first = coach.name.split(" ")[0];
    const average = profile.reviews.reduce((sum, r) => sum + r.rating, 0) / profile.reviews.length;
    const taught = window.courses.filter((course) => course.trainers.includes(coach.name));
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
          <a class="coach-chat-link" href="/trainers?chat=${encodeURIComponent(coach.name)}">Chat with ${escapeHtml(first)}</a>
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
                      (c) => `<li><a href="/course?id=${escapeHtml(c.id)}"><b>${escapeHtml(c.title)}</b><small>${escapeHtml(c.level)} · ${window.flexformCourses.formatPrice(c.price)}</small></a></li>`,
                    )
                    .join("")}</ul>`
                : `<p class="coach-text">${escapeHtml(first)} isn't part of a course yet.</p>`
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
      <h1>We couldn't find that coach.</h1>
      <p>They may have moved on or the link is incorrect.</p>
      <a class="dark-button" href="/trainers">Browse all coaches</a>
    </div>`;

  useEffect(() => {
    const load = async () => {
      const container = document.querySelector("#coachDetail");
      container.innerHTML = '<div class="detail-empty" role="status"><h1>Loading coach…</h1></div>';
      try {
        const [coachList] = await Promise.all([
          window.flexformApi.getCoaches(),
          window.flexformApi.getCourses(),
        ]);
        const id = searchParams.get("id");
        const foundCoach = coachList.find((item) => item.name.toLowerCase().replace(/\s+/g, "-") === id);
        const foundProfile = foundCoach && window.coachProfiles[foundCoach.name];

        if (!foundCoach || !foundProfile) {
          document.title = "Coach not found · flexform.";
          container.innerHTML = renderNotFound();
          setLoaded(true);
          return;
        }

        document.title = `${foundCoach.name} · flexform.`;
        container.innerHTML = renderCoach(foundCoach, foundProfile);
        setCoach(foundCoach);
        setProfile(foundProfile);
        setLoaded(true);

        document.querySelector("#bookButton")?.addEventListener("click", (event) => {
          const booked = loadSet("bookedCoaches");
          booked.add(foundCoach.name);
          storeSet("bookedCoaches", booked);
          event.currentTarget.textContent = "✓ Request sent";
          event.currentTarget.disabled = true;
          notify(`Request sent to ${foundCoach.name}. (Demo — nothing is booked.)`);
        });

        document.querySelector("#saveButton")?.addEventListener("click", (event) => {
          const savedSet = loadSet("savedCoaches");
          const nowSaved = !savedSet.has(foundCoach.name);
          if (nowSaved) savedSet.add(foundCoach.name);
          else savedSet.delete(foundCoach.name);
          storeSet("savedCoaches", savedSet);
          event.currentTarget.textContent = nowSaved ? "♥ Saved" : "♡ Save coach";
          event.currentTarget.setAttribute("aria-pressed", String(nowSaved));
          notify(nowSaved ? `${foundCoach.name} saved.` : `${foundCoach.name} removed from saved coaches.`);
        });
      } catch (err) {
        container.innerHTML = `<div class="detail-empty" role="alert"><h1>${err.message}</h1><a class="dark-button" href="/trainers">Try again</a></div>`;
        setLoaded(true);
      }
    };
    load();
  }, [searchParams]);

  if (!loaded) {
    return (
      <section className="page active" id="page-coach">
        <a className="back-link" href="/trainers">← All coaches</a>
        <div id="coachDetail" className="detail-empty" role="status"><h1>Loading coach…</h1></div>
      </section>
    );
  }

  return (
    <section className="page active" id="page-coach">
      <a className="back-link" href="/trainers">← All coaches</a>
      <div id="coachDetail"></div>
    </section>
  );
}