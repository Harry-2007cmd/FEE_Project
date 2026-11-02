import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/styles.css";
import "../styles/courses.css";
import "../styles/course-detail.css";
import "../styles/lesson.css";
import { escapeHtml } from "../lib/utils.js";

const lessonUrl = (course, number) => `/lesson?course=${encodeURIComponent(course.id)}&n=${number}`;

const renderNotFound = (message) => `
  <div class="detail-empty">
    <h1>${message}</h1>
    <p>The link may be incorrect.</p>
    <a class="dark-button" href="/courses">Browse all courses</a>
  </div>`;

const renderLocked = (course) => `
  <div class="detail-empty">
    <h1>Enrol to watch ${escapeHtml(course.title)}</h1>
    <p>Lessons open once you've enrolled. It's a demo, so no payment is taken.</p>
    <button type="button" class="dark-button" id="enrolHere">Enrol${course.price ? ` — $${course.price}` : " for free"}</button>
    <p><a class="side-cta" href="/course?id=${escapeHtml(course.id)}">View course details →</a></p>
  </div>`;

const renderLesson = (course, lessons, lesson) => {
  const done = new Set(window.flexformActivity.completedLessons(course.id));
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
          ${next ? `<a href="${lessonUrl(course, next.number)}">${escapeHtml(next.title)} →</a>` : `<a href="/course?id=${escapeHtml(course.id)}">Back to course →</a>`}
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

export default function Lesson() {
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const notify = (message) => {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  };

  useEffect(() => {
    const load = async () => {
      const container = document.querySelector("#lessonView");
      const backLink = document.querySelector("#backToCourse");
      const courseParam = searchParams.get("course");
      const courseData = window.courses.find((item) => item.id === courseParam);
      backLink.href = "/courses";
      backLink.textContent = "← All courses";

      if (!courseData) {
        document.title = "Lesson not found · flexform.";
        container.innerHTML = renderNotFound("We couldn't find that course.");
        setLoaded(true);
        return;
      }
      backLink.href = `/course?id=${courseData.id}`;
      backLink.textContent = `← ${courseData.title}`;

      const lessonsData = window.lessonsFor(courseData);
      const raw = searchParams.get("n");
      const number = /^\d+$/.test(raw || "") ? Number(raw) : 1;
      const lessonData = lessonsData[number - 1];
      if (!lessonData) {
        document.title = "Lesson not found · flexform.";
        container.innerHTML = renderNotFound("We couldn't find that lesson.");
        setLoaded(true);
        return;
      }
      document.title = `${lessonData.title} · ${courseData.title} · flexform.`;

      if (!window.flexformCourses.isStarted(courseData.title)) {
        container.innerHTML = renderLocked(courseData);
        document.querySelector("#enrolHere")?.addEventListener("click", () => {
          window.flexformCourses.start(courseData.title);
          notify(`You're enrolled in ${courseData.title}. (Demo — no payment taken.)`);
          window.location.reload();
        });
        setLoaded(true);
        return;
      }

      setCourse(courseData);
      setLessons(lessonsData);
      setLesson(lessonData);
      setLoaded(true);
    };
    load();
  }, [searchParams]);

  useEffect(() => {
    if (!loaded || !lesson) return;
    const container = document.querySelector("#lessonView");
    container.innerHTML = renderLesson(course, lessons, lesson);
    document.querySelector("#completeButton")?.addEventListener("click", () => {
      const nowDone = !window.flexformActivity.isLessonDone(course.id, lesson.number);
      window.flexformActivity.setLessonDone(course.id, lesson.number, nowDone);
      window.location.reload();
      const all = window.flexformActivity.completedLessons(course.id).length === lessons.length;
      notify(nowDone ? (all ? `You finished ${course.title}. Well done!` : "Lesson complete. Nice work.") : "Marked as not complete.");
    });
  }, [loaded, course, lessons, lesson]);

  if (!loaded) {
    return (
      <section className="page active" id="page-lesson">
        <a className="back-link" id="backToCourse" href="/courses">← All courses</a>
        <div id="lessonView" className="detail-empty" role="status"><h1>Loading lesson…</h1></div>
      </section>
    );
  }

  return (
    <section className="page active" id="page-lesson">
      <a className="back-link" id="backToCourse" href="/courses">← All courses</a>
      <div id="lessonView"></div>
    </section>
  );
}