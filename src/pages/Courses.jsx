import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [, setTick] = useState(0);

  const toast = (message) => {
    const element = document.querySelector("#toast");
    if (!element) return;
    element.textContent = message;
    element.classList.add("show");
    setTimeout(() => element.classList.remove("show"), 2600);
  };

  const startCourse = (title) => {
    window.flexformCourses.start(title);
    setTick((t) => t + 1);
    toast("Nice work. Your course progress is saved.");
  };

  const renderCard = (course) => {
    const started = window.flexformCourses.isStarted(course.title);
    const completed = window.flexformActivity.completedLessons(course.id).length;
    const progress = Math.round((completed / course.lessons) * 100);
    const detailUrl = `/course?id=${encodeURIComponent(course.id)}`;
    return (
      <article className="course-card" key={course.id}>
        <small>{course.subtitle}</small>
        <h3><Link to={detailUrl}>{course.title}</Link></h3>
        <p>{course.description}</p>
        <small className="course-meta">
          {course.level} · {course.lessons} lessons · {course.minutes} min · {window.flexformCourses.formatPrice(course.price)}
        </small>
        <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress} aria-label={`${course.title} progress`}>
          <i style={{ width: `${progress}%` }}></i>
        </div>
        <small className="course-meta">{completed} of {course.lessons} lessons done</small>
        <div className="course-actions">
          <button
            data-course={course.title}
            style={started ? { background: "var(--coral)", color: "var(--on-accent)" } : undefined}
            onClick={() => startCourse(course.title)}
          >
            {started ? "✓ Progress saved" : "Start course →"}
          </button>
          <Link className="course-details-link" to={detailUrl} aria-label={`View details for ${course.title}`}>Details →</Link>
        </div>
      </article>
    );
  };

  const loadCourses = async () => {
    try {
      const items = await window.flexformApi.getCourses();
      setCourses(items);
      setLoaded(true);
    } catch (err) {
      setError(err.message);
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleFreeClass = () => {
    const card = [...document.querySelectorAll("#courseList [data-course]")].find(
      (item) => item.dataset.course === "Quiet cardio",
    );
    card?.scrollIntoView({ behavior: "smooth", block: "center" });
    card?.click();
  };

  const intro = (
    <div className="page-intro split">
      <div>
        <p className="eyebrow">A little structure goes a long way</p>
        <h1>Your <em>library.</em></h1>
        <p className="lede">
          Short, thoughtful programs for the days you have — not the
          days you wish you had.
        </p>
      </div>
      <div className="rhythm-pill">▶ <b>1 free class</b> included</div>
    </div>
  );

  const freeClass = (
    <div className="free-class">
      <div>
        <p className="eyebrow">Start here · no commitment</p>
        <h2>A free class to find your <em>pace.</em></h2>
        <p>
          Press play on a 12-minute full-body reset. No equipment, no
          perfect form required.
        </p>
        <button className="dark-button" data-free-class onClick={handleFreeClass}>
          Try the free class ▶
        </button>
      </div>
      <div className="abstract-photo"><span>12:04</span></div>
    </div>
  );

  const heading = (
    <div className="section-heading">
      <div>
        <p className="eyebrow">Built for real life</p>
        <h2>Move at your pace.</h2>
      </div>
    </div>
  );

  if (!loaded) {
    return (
      <section className="page active" id="page-courses">
        {intro}
        {freeClass}
        {heading}
        <div id="courseList" className="course-grid">
          <div className="cream-card" role="status"><h2>Loading courses…</h2></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page active" id="page-courses">
        {intro}
        {freeClass}
        {heading}
        <div id="courseList" className="course-grid">
          <div className="cream-card" role="alert">
            <h2>{error}</h2>
            <button className="sun-button" data-retry onClick={() => { setError(null); setLoaded(false); loadCourses(); }}>Try again</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page active" id="page-courses">
      {intro}
      {freeClass}
      {heading}
      <div id="courseList" className="course-grid">{courses.map(renderCard)}</div>
    </section>
  );
}