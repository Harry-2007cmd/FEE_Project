import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "../styles/styles.css";
import "../styles/courses.css";
import "../styles/course-detail.css";

const stars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);
const toneFor = (index) => ["sun", "lilac", "mint", "pink"][index % 4];

export default function CourseDetail() {
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [courseIndex, setCourseIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [, setTick] = useState(0);

  const id = searchParams.get("id");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoaded(false);
      try {
        const [courseList] = await Promise.all([
          window.flexformApi.getCourses(),
          window.flexformApi.getCoaches(),
        ]);
        if (cancelled) return;
        const index = courseList.findIndex((item) => item.id === id);
        const found = courseList[index];

        if (!found) {
          document.title = "Course not found · flexform.";
          setCourse(null);
        } else {
          document.title = `${found.title} · flexform.`;
          setCourse(found);
          setCourseIndex(index);
          setEnrolled(window.flexformCourses.isStarted(found.title));
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (!loaded) {
    return (
      <section className="page active" id="page-course">
        <Link className="back-link" to="/courses">← All courses</Link>
        <div className="detail-empty" role="status"><h1>Loading course…</h1></div>
      </section>
    );
  }

  if (error || !course) {
    return (
      <section className="page active" id="page-course">
        <Link className="back-link" to="/courses">← All courses</Link>
        <div className="detail-empty">
          <h1>{error || "We couldn't find that course."}</h1>
          <p>{error ? "" : "It may have been moved or the link is incorrect."}</p>
          <Link className="dark-button" to="/courses">Browse all courses</Link>
        </div>
      </section>
    );
  }

  const lessons = window.lessonsFor(course);
  const done = new Set(window.flexformActivity.completedLessons(course.id));
  const percent = Math.round((done.size / lessons.length) * 100);
  const next = lessons.find((lesson) => !done.has(lesson.number));
  const lessonUrl = (number) => `/lesson?course=${encodeURIComponent(course.id)}&n=${number}`;
  const enrolLabel = course.price ? `Enrol — $${course.price}` : "Start for free";

  const notify = (message) => {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  };

  const handleEnrol = () => {
    window.flexformCourses.start(course.title);
    setEnrolled(true);
    setTick((t) => t + 1);
    notify(`You're enrolled in ${course.title}. (Demo — no payment taken.)`);
  };

  const handleLeave = () => {
    window.flexformCourses.leave(course.title);
    setEnrolled(false);
    setTick((t) => t + 1);
    notify(`You left ${course.title}.`);
  };

  return (
    <section className="page active" id="page-course">
      <Link className="back-link" to="/courses">← All courses</Link>
      <div id="courseDetail">
        <header className="detail-hero" data-tone={toneFor(courseIndex)}>
          <div>
            <p className="eyebrow">{course.subtitle}</p>
            <h1>{course.title}</h1>
            <p className="lede">{course.description}</p>
            <ul className="detail-chips" aria-label="Course facts">
              <li>{course.level}</li>
              <li>{course.weeks} {course.weeks === 1 ? "week" : "weeks"}</li>
              <li>{course.lessons} lessons</li>
              <li>{course.minutes} min total</li>
              <li><span aria-hidden="true">★</span> {course.rating} ({course.reviews.length} reviews)</li>
            </ul>
          </div>
          <aside className="enrol-card" aria-label="Enrol">
            <p className="price">{window.flexformCourses.formatPrice(course.price)}</p>
            <button type="button" className="enrol-button" id="enrolButton" disabled={enrolled} onClick={handleEnrol}>
              {enrolled ? "✓ Enrolled" : enrolLabel}
            </button>
            {enrolled && (
              <button type="button" className="link-button" id="leaveButton" onClick={handleLeave}>
                Leave course
              </button>
            )}
            {enrolled && (
              <div id="courseProgress">
                <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent} aria-label="Course progress">
                  <i style={{ width: `${percent}%` }}></i>
                </div>
                <p className="enrol-progress">{done.size} of {lessons.length} lessons · {percent}%</p>
                <Link className="enrol-link" to={next ? lessonUrl(next.number) : lessonUrl(1)}>
                  {done.size === 0 ? "Start lessons" : next ? "Continue lessons" : "Review lessons"} →
                </Link>
              </div>
            )}
            <p className="enrol-note">Demo only — no payment is taken.</p>
          </aside>
        </header>

        <div className="detail-grid">
          <div className="detail-main">
            <section className="detail-section" aria-labelledby="learnHeading">
              <h2 id="learnHeading">What you'll learn</h2>
              <ul className="learn-list">{course.learn.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </section>

            <section className="detail-section" aria-labelledby="timelineHeading">
              <h2 id="timelineHeading">Timeline</h2>
              <ol className="timeline">
                {course.timeline.map((step, i) => (
                  <li key={i}>
                    <small>{step.when}</small>
                    <b>{step.title}</b>
                    <p>{step.detail}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="detail-section" aria-labelledby="lessonsHeading">
              <h2 id="lessonsHeading">Lessons</h2>
              <div id="lessonsBlock">
                <ol className="syllabus">
                  {lessons.map((lesson) => {
                    const isDone = done.has(lesson.number);
                    const label = (
                      <>
                        <span className={`lesson-mark${isDone ? " done" : ""}`} aria-hidden="true">
                          {isDone ? "✓" : enrolled ? lesson.number : "🔒"}
                        </span>
                        <span className="syllabus-title">{lesson.title}</span>
                        <small>{lesson.minutes} min</small>
                        {isDone && <span className="sr-only">Completed</span>}
                      </>
                    );
                    return (
                      <li key={lesson.number}>
                        {enrolled ? (
                          <Link to={lessonUrl(lesson.number)}>{label}</Link>
                        ) : (
                          <div className="syllabus-locked">{label}</div>
                        )}
                      </li>
                    );
                  })}
                </ol>
                {!enrolled && <p className="sample-note">Enrol to unlock the lessons.</p>}
              </div>
            </section>

            <section className="detail-section" aria-labelledby="reviewsHeading">
              <h2 id="reviewsHeading">Reviews</h2>
              <p className="sample-note">Sample reviews for this demo.</p>
              <ul className="review-list">
                {course.reviews.map((review, i) => (
                  <li className="review" key={i}>
                    <div className="review-head">
                      <b>{review.name}</b>
                      <span className="stars" role="img" aria-label={`${review.rating} out of 5 stars`}>{stars(review.rating)}</span>
                    </div>
                    <p>{review.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="detail-side">
            <section className="detail-section" aria-labelledby="trainersHeading">
              <h2 id="trainersHeading">Trainers involved</h2>
              <ul className="detail-trainers">
                {course.trainers.map((name, i) => {
                  const coach = window.trainers.find((item) => item.name === name);
                  if (!coach) return null;
                  return (
                    <li className="detail-trainer" key={i}>
                      <span className="detail-avatar" data-tone={coach.tone} aria-hidden="true">{coach.initials}</span>
                      <div><b>{coach.name}</b><small>{coach.role}</small></div>
                    </li>
                  );
                })}
              </ul>
              <Link className="side-cta" to="/trainers">Meet all coaches →</Link>
            </section>

            <section className="detail-section" aria-labelledby="goodHeading">
              <h2 id="goodHeading">Good to know</h2>
              <dl className="good-list">
                <dt>Who it's for</dt><dd>{course.forWho}</dd>
                <dt>What you need</dt><dd>{course.equipment}</dd>
                <dt>Format</dt><dd>{course.format}</dd>
              </dl>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}