import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "../styles/styles.css";
import "../styles/courses.css";
import "../styles/course-detail.css";
import "../styles/lesson.css";

const lessonUrl = (course, number) => `/lesson?course=${encodeURIComponent(course.id)}&n=${number}`;

export default function Lesson() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState({ status: "loading" }); // loading | notFound | locked | ready
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [doneNumbers, setDoneNumbers] = useState(new Set());
  const [notFoundMessage, setNotFoundMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    const courseParam = searchParams.get("course");
    const courseData = window.courses.find((item) => item.id === courseParam);

    if (!courseData) {
      document.title = "Lesson not found · flexform.";
      setNotFoundMessage("We couldn't find that course.");
      setState({ status: "notFound" });
      return;
    }

    const lessonsData = window.lessonsFor(courseData);
    const raw = searchParams.get("n");
    const number = /^\d+$/.test(raw || "") ? Number(raw) : 1;
    const lessonData = lessonsData[number - 1];

    if (!lessonData) {
      document.title = "Lesson not found · flexform.";
      setNotFoundMessage("We couldn't find that lesson.");
      setState({ status: "notFound" });
      return;
    }

    document.title = `${lessonData.title} · ${courseData.title} · flexform.`;

    if (!window.flexformCourses.isStarted(courseData.title)) {
      setCourse(courseData);
      setState({ status: "locked" });
      return;
    }

    if (cancelled) return;
    setCourse(courseData);
    setLessons(lessonsData);
    setLesson(lessonData);
    setDoneNumbers(new Set(window.flexformActivity.completedLessons(courseData.id)));
    setState({ status: "ready" });

    return () => { cancelled = true; };
  }, [searchParams]);

  const handleEnrol = () => {
    window.flexformCourses.start(course.title);
    const toast = document.querySelector("#toast");
    if (toast) {
      toast.textContent = `You're enrolled in ${course.title}. (Demo — no payment taken.)`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2600);
    }
    setLessons(window.lessonsFor(course));
    setDoneNumbers(new Set(window.flexformActivity.completedLessons(course.id)));
    setState({ status: "ready" });
  };

  const handleComplete = () => {
    const nowDone = !window.flexformActivity.isLessonDone(course.id, lesson.number);
    window.flexformActivity.setLessonDone(course.id, lesson.number, nowDone);
    const next = new Set(doneNumbers);
    if (nowDone) next.add(lesson.number); else next.delete(lesson.number);
    setDoneNumbers(next);
    const all = next.size === lessons.length;
    const toast = document.querySelector("#toast");
    if (toast) {
      toast.textContent = nowDone
        ? (all ? `You finished ${course.title}. Well done!` : "Lesson complete. Nice work.")
        : "Marked as not complete.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2600);
    }
  };

  if (state.status === "loading") {
    return (
      <section className="page active" id="page-lesson">
        <Link className="back-link" to="/courses">← All courses</Link>
        <div id="lessonView" className="detail-empty" role="status"><h1>Loading lesson…</h1></div>
      </section>
    );
  }

  if (state.status === "notFound") {
    return (
      <section className="page active" id="page-lesson">
        <Link className="back-link" to="/courses">← All courses</Link>
        <div id="lessonView" className="detail-empty">
          <h1>{notFoundMessage}</h1>
          <p>The link may be incorrect.</p>
          <Link className="dark-button" to="/courses">Browse all courses</Link>
        </div>
      </section>
    );
  }

  if (state.status === "locked") {
    return (
      <section className="page active" id="page-lesson">
        <Link className="back-link" to={`/course?id=${course.id}`}>← {course.title}</Link>
        <div id="lessonView" className="detail-empty">
          <h1>Enrol to watch {course.title}</h1>
          <p>Lessons open once you've enrolled. It's a demo, so no payment is taken.</p>
          <button type="button" className="dark-button" onClick={handleEnrol}>
            Enrol{course.price ? ` — $${course.price}` : " for free"}
          </button>
          <p><Link className="side-cta" to={`/course?id=${course.id}`}>View course details →</Link></p>
        </div>
      </section>
    );
  }

  const percent = Math.round((doneNumbers.size / lessons.length) * 100);
  const isDone = doneNumbers.has(lesson.number);
  const previous = lessons[lesson.number - 2];
  const next = lessons[lesson.number];

  return (
    <section className="page active" id="page-lesson">
      <Link className="back-link" to={`/course?id=${course.id}`}>← {course.title}</Link>
      <div id="lessonView">
        <div className="lesson-layout">
          <div className="lesson-main">
            <div className="video-placeholder" role="img" aria-label={`Video placeholder for ${lesson.title}`}>
              <span className="play-mark" aria-hidden="true">▶</span>
              <small>Demo lesson · {lesson.minutes} min · video not included</small>
            </div>
            <p className="eyebrow">{course.title} · Lesson {lesson.number} of {lessons.length}</p>
            <h1>{lesson.title}</h1>
            <p className="lede">{lesson.summary}</p>
            <div className="lesson-actions">
              <button
                type="button"
                className={`enrol-button lesson-complete${isDone ? " is-done" : ""}`}
                id="completeButton"
                aria-pressed={isDone}
                onClick={handleComplete}
              >
                {isDone ? "✓ Completed — undo" : "Mark lesson complete"}
              </button>
            </div>
            <nav className="lesson-pager" aria-label="Lesson navigation">
              {previous ? <Link to={lessonUrl(course, previous.number)}>← {previous.title}</Link> : <span></span>}
              {next ? <Link to={lessonUrl(course, next.number)}>{next.title} →</Link> : <Link to={`/course?id=${course.id}`}>Back to course →</Link>}
            </nav>
          </div>
          <aside className="lesson-side" aria-labelledby="listHeading">
            <h2 id="listHeading">Lessons</h2>
            <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent} aria-label="Course progress"><i style={{ width: `${percent}%` }}></i></div>
            <p className="lesson-count" id="progressText">{doneNumbers.size} of {lessons.length} complete · {percent}%</p>
            <ol className="lesson-list">
              {lessons.map((item) => (
                <li key={item.number} className={`${item.number === lesson.number ? "current" : ""}${doneNumbers.has(item.number) ? " is-done" : ""}`}>
                  <Link to={lessonUrl(course, item.number)} aria-current={item.number === lesson.number ? "page" : undefined}>
                    <span className="lesson-mark" aria-hidden="true">{doneNumbers.has(item.number) ? "✓" : item.number}</span>
                    <span className="lesson-name">{item.title}</span>
                    <small>{item.minutes} min</small>
                    <span className="sr-only">{doneNumbers.has(item.number) ? "Completed" : "Not completed"}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  );
}