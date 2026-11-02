import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import "../styles/courses.css";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toast = (message) => {
    const element = document.querySelector("#toast");
    if (!element) return;
    element.textContent = message;
    element.classList.add("show");
    setTimeout(() => element.classList.remove("show"), 2600);
  };

  const courseCardHtml = (course) => {
    const started = window.flexformCourses.isStarted(course.title);
    const completed = window.flexformActivity.completedLessons(course.id).length;
    const progress = Math.round((completed / course.lessons) * 100);
    const label = started ? "✓ Progress saved" : "Start course →";
    return `
      <article class="course-card">
        <small>${course.subtitle}</small>
        <h3><a href="/course?id=${course.id}">${course.title}</a></h3>
        <p>${course.description}</p>
        <small class="course-meta">${course.level} · ${course.lessons} lessons · ${course.minutes} min · ${window.flexformCourses.formatPrice(course.price)}</small>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}" aria-label="${course.title} progress"><i style="width:${progress}%"></i></div>
        <small class="course-meta">${completed} of ${course.lessons} lessons done</small>
        <div class="course-actions">
          <button data-course="${course.title}"${started ? ' style="background:var(--coral);color:var(--on-accent)"' : ""}>${label}</button>
          <a class="course-details-link" href="/course?id=${course.id}" aria-label="View details for ${course.title}">Details →</a>
        </div>
      </article>`;
  };

  const loadCourses = async () => {
    const list = document.querySelector("#courseList");
    if (list) list.innerHTML = '<div class="cream-card" role="status"><h2>Loading courses…</h2></div>';
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

  const handleClick = (event) => {
    if (event.target.closest("[data-free-class]")) {
      const card = [...document.querySelectorAll("#courseList [data-course]")].find(
        (item) => item.dataset.course === "Quiet cardio",
      );
      card?.scrollIntoView({ behavior: "smooth", block: "center" });
      card?.click();
      return;
    }
    if (event.target.closest("[data-retry]")) {
      loadCourses();
      return;
    }
    const button = event.target.closest("[data-course]");
    if (!button) return;
    button.textContent = "✓ Progress saved";
    button.style.background = "var(--coral)";
    button.style.color = "var(--on-accent)";
    window.flexformCourses.start(button.dataset.course);
    toast("Nice work. Your course progress is saved.");
  };

  if (!loaded) {
    return (
      <section className="page active" id="page-courses">
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
        <div className="free-class">
          <div>
            <p className="eyebrow">Start here · no commitment</p>
            <h2>A free class to find your <em>pace.</em></h2>
            <p>
              Press play on a 12-minute full-body reset. No equipment, no
              perfect form required.
            </p>
            <button className="dark-button" data-free-class disabled>
              Try the free class ▶
            </button>
          </div>
          <div className="abstract-photo"><span>12:04</span></div>
        </div>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Built for real life</p>
            <h2>Move at your pace.</h2>
          </div>
        </div>
        <div id="courseList" className="course-grid">
          <div className="cream-card" role="status"><h2>Loading courses…</h2></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page active" id="page-courses">
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
        <div className="free-class">
          <div>
            <p className="eyebrow">Start here · no commitment</p>
            <h2>A free class to find your <em>pace.</em></h2>
            <p>
              Press play on a 12-minute full-body reset. No equipment, no
              perfect form required.
            </p>
            <button className="dark-button" data-free-class disabled>
              Try the free class ▶
            </button>
          </div>
          <div className="abstract-photo"><span>12:04</span></div>
        </div>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Built for real life</p>
            <h2>Move at your pace.</h2>
          </div>
        </div>
        <div id="courseList" className="course-grid">
          <div className="cream-card" role="alert">
            <h2>{error}</h2>
            <button className="sun-button" data-retry onClick={() => window.location.reload()}>Try again</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page active" id="page-courses" onClick={handleClick}>
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
      <div className="free-class">
        <div>
          <p className="eyebrow">Start here · no commitment</p>
          <h2>A free class to find your <em>pace.</em></h2>
          <p>
            Press play on a 12-minute full-body reset. No equipment, no
            perfect form required.
          </p>
          <button className="dark-button" data-free-class>
            Try the free class ▶
          </button>
        </div>
        <div className="abstract-photo"><span>12:04</span></div>
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Built for real life</p>
          <h2>Move at your pace.</h2>
        </div>
      </div>
      <div id="courseList" className="course-grid" dangerouslySetInnerHTML={{ __html: courses.map(courseCardHtml).join("") }} />
    </section>
  );
}