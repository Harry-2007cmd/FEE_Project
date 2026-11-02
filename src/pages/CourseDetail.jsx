import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/styles.css";
import "../styles/courses.css";
import "../styles/course-detail.css";
import { escapeHtml } from "../lib/utils.js";

const stars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);
const toneFor = (index) => ["sun", "lilac", "mint", "pink"][index % 4];

export default function CourseDetail() {
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const lessonUrl = (course, number) => `/lesson?course=${encodeURIComponent(course.id)}&n=${number}`;

  const progressBlockHtml = (course) => {
    if (!window.flexformCourses.isStarted(course.title)) return "";
    const lessons = window.lessonsFor(course);
    const done = new Set(window.flexformActivity.completedLessons(course.id));
    const percent = Math.round((done.size / lessons.length) * 100);
    const next = lessons.find((lesson) => !done.has(lesson.number));
    return `<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" aria-label="Course progress"><i style="width:${percent}%"></i></div>
      <p class="enrol-progress">${done.size} of ${lessons.length} lessons · ${percent}%</p>
      <a class="enrol-link" href="${next ? lessonUrl(course, next.number) : lessonUrl(course, 1)}">${done.size === 0 ? "Start lessons" : next ? "Continue lessons" : "Review lessons"} →</a>`;
  };

  const lessonsBlockHtml = (course) => {
    const enrolled = window.flexformCourses.isStarted(course.title);
    const done = new Set(window.flexformActivity.completedLessons(course.id));
    return `<ol class="syllabus">${window.lessonsFor(course)
      .map((lesson) => {
        const label = `<span class="lesson-mark${done.has(lesson.number) ? " done" : ""}" aria-hidden="true">${done.has(lesson.number) ? "✓" : enrolled ? lesson.number : "🔒"}</span><span class="syllabus-title">${escapeHtml(lesson.title)}</span><small>${lesson.minutes} min</small>${done.has(lesson.number) ? '<span class="sr-only">Completed</span>' : ""}`;
        return `<li>${enrolled ? `<a href="${lessonUrl(course, lesson.number)}">${label}</a>` : `<div class="syllabus-locked">${label}</div>`}</li>`;
      })
      .join("")}</ol>${enrolled ? "" : '<p class="sample-note">Enrol to unlock the lessons.</p>'}`;
  };

  const enrolLabel = (course) => (course.price ? `Enrol — $${course.price}` : "Start for free");

  const renderCourse = (course, index) => {
    const enrolled = window.flexformCourses.isStarted(course.title);
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
          <p class="price">${window.flexformCourses.formatPrice(course.price)}</p>
          <button type="button" class="enrol-button" id="enrolButton"${enrolled ? " disabled" : ""}>${enrolled ? "✓ Enrolled" : enrolLabel(course)}</button>
          <button type="button" class="link-button${enrolled ? "" : " hidden"}" id="leaveButton">Leave course</button>
          <div id="courseProgress">${progressBlockHtml(course)}</div>
          <p class="enrol-note">Demo only — no payment is taken.</p>
        </aside>
      </header>

      <div class="detail-grid">
        <div class="detail-main">
          <section class="detail-section" aria-labelledby="learnHeading">
            <h2 id="learnHeading">What you'll learn</h2>
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
            <ul class="detail-trainers">${course.trainers
              .map((name) => {
                const coach = window.trainers.find((item) => item.name === name);
                if (!coach) return "";
                return `<li class="detail-trainer">
                  <span class="detail-avatar" data-tone="${coach.tone}" aria-hidden="true">${escapeHtml(coach.initials)}</span>
                  <div><b>${escapeHtml(coach.name)}</b><small>${escapeHtml(coach.role)}</small></div>
                </li>`;
              })
              .join("")}</ul>
            <a class="side-cta" href="/trainers">Meet all coaches →</a>
          </section>

          <section class="detail-section" aria-labelledby="goodHeading">
            <h2 id="goodHeading">Good to know</h2>
            <dl class="good-list">
              <dt>Who it's for</dt><dd>${escapeHtml(course.forWho)}</dd>
              <dt>What you need</dt><dd>${escapeHtml(course.equipment)}</dd>
              <dt>Format</dt><dd>${escapeHtml(course.format)}</dd>
            </dl>
          </section>
        </div>
      </div>`;
  };

  const renderNotFound = () => `
    <div class="detail-empty">
      <h1>We couldn't find that course.</h1>
      <p>It may have been moved or the link is incorrect.</p>
      <a class="dark-button" href="/courses">Browse all courses</a>
    </div>`;

  useEffect(() => {
    const load = async () => {
      const container = document.querySelector("#courseDetail");
      container.innerHTML = '<div class="detail-empty" role="status"><h1>Loading course…</h1></div>';
      try {
        const [courseList] = await Promise.all([
          window.flexformApi.getCourses(),
          window.flexformApi.getCoaches(),
        ]);
        const id = searchParams.get("id");
        const index = courseList.findIndex((item) => item.id === id);
        const found = courseList[index];

        if (!found) {
          document.title = "Course not found · flexform.";
          container.innerHTML = renderNotFound();
          setLoaded(true);
          return;
        }

        document.title = `${found.title} · flexform.`;
        container.innerHTML = renderCourse(found, index);
        setCourse(found);
        setLoaded(true);

        // Bind enrol/leave buttons after render
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
          document.querySelector("#courseProgress").innerHTML = progressBlockHtml(found);
          document.querySelector("#lessonsBlock").innerHTML = lessonsBlockHtml(found);
        };

        enrolButton?.addEventListener("click", () => {
          window.flexformCourses.start(found.title);
          enrolButton.textContent = "✓ Enrolled";
          enrolButton.disabled = true;
          leaveButton.classList.remove("hidden");
          refreshLessons();
          notify(`You're enrolled in ${found.title}. (Demo — no payment taken.)`);
        });

        leaveButton?.addEventListener("click", () => {
          window.flexformCourses.leave(found.title);
          enrolButton.textContent = enrolLabel(found);
          enrolButton.disabled = false;
          leaveButton.classList.add("hidden");
          refreshLessons();
          enrolButton.focus();
          notify(`You left ${found.title}.`);
        });
      } catch (err) {
        document.querySelector("#courseDetail").innerHTML = `<div class="detail-empty" role="alert"><h1>${err.message}</h1><a class="dark-button" href="/courses">Try again</a></div>`;
        setError(err.message);
        setLoaded(true);
      }
    };
    load();
  }, [searchParams]);

  if (!loaded) {
    return (
      <section className="page active" id="page-course">
        <a className="back-link" href="/courses">← All courses</a>
        <div id="courseDetail" className="detail-empty" role="status"><h1>Loading course…</h1></div>
      </section>
    );
  }

  return (
    <section className="page active" id="page-course">
      <a className="back-link" href="/courses">← All courses</a>
      <div id="courseDetail"></div>
    </section>
  );
}