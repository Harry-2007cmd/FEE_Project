import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "../styles/styles.css";
import "../styles/courses.css";
import "../styles/course-detail.css";
import "../styles/coach.css";

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
  const [status, setStatus] = useState("loading"); // loading | ready | notFound | error
  const [errorMessage, setErrorMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("loading");
      try {
        const [coachList] = await Promise.all([
          window.flexformApi.getCoaches(),
          window.flexformApi.getCourses(),
        ]);
        if (cancelled) return;
        const id = searchParams.get("id");
        const foundCoach = coachList.find((item) => item.name.toLowerCase().replace(/\s+/g, "-") === id);
        const foundProfile = foundCoach && window.coachProfiles[foundCoach.name];

        if (!foundCoach || !foundProfile) {
          document.title = "Coach not found · flexform.";
          setStatus("notFound");
          return;
        }

        document.title = `${foundCoach.name} · flexform.`;
        setCoach(foundCoach);
        setProfile(foundProfile);
        setSaved(loadSet("savedCoaches").has(foundCoach.name));
        setBooked(loadSet("bookedCoaches").has(foundCoach.name));
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(err.message);
        setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, [searchParams]);

  const handleBook = () => {
    const bookedSet = loadSet("bookedCoaches");
    bookedSet.add(coach.name);
    storeSet("bookedCoaches", bookedSet);
    setBooked(true);
    notify(`Request sent to ${coach.name}. (Demo — nothing is booked.)`);
  };

  const handleSave = () => {
    const savedSet = loadSet("savedCoaches");
    const nowSaved = !savedSet.has(coach.name);
    if (nowSaved) savedSet.add(coach.name);
    else savedSet.delete(coach.name);
    storeSet("savedCoaches", savedSet);
    setSaved(nowSaved);
    notify(nowSaved ? `${coach.name} saved.` : `${coach.name} removed from saved coaches.`);
  };

  if (status !== "ready") {
    return (
      <section className="page active" id="page-coach">
        <Link className="back-link" to="/trainers">← All coaches</Link>
        {status === "loading" && (
          <div id="coachDetail" className="detail-empty" role="status"><h1>Loading coach…</h1></div>
        )}
        {status === "notFound" && (
          <div id="coachDetail" className="detail-empty">
            <h1>We couldn't find that coach.</h1>
            <p>They may have moved on or the link is incorrect.</p>
            <Link className="dark-button" to="/trainers">Browse all coaches</Link>
          </div>
        )}
        {status === "error" && (
          <div id="coachDetail" className="detail-empty" role="alert">
            <h1>{errorMessage}</h1>
            <Link className="dark-button" to="/trainers">Try again</Link>
          </div>
        )}
      </section>
    );
  }

  const first = coach.name.split(" ")[0];
  const average = profile.reviews.reduce((sum, r) => sum + r.rating, 0) / profile.reviews.length;
  const taught = window.courses.filter((course) => course.trainers.includes(coach.name));

  return (
    <section className="page active" id="page-coach">
      <Link className="back-link" to="/trainers">← All coaches</Link>
      <div id="coachDetail">
        <header className="detail-hero" data-tone={toneFor(coach.tone)}>
          <div>
            <p className="eyebrow">{coach.specialty}</p>
            <h1>{coach.name}</h1>
            <p className="lede">{coach.role}</p>
            <ul className="detail-chips" aria-label="Coach facts">
              <li>{profile.years} years coaching</li>
              <li><span aria-hidden="true">★</span> {coach.rating} rating</li>
              <li>{coach.availability === "today" ? "Available today" : "Available this week"}</li>
              {coach.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </div>
          <aside className="enrol-card" aria-label={`Book ${first}`}>
            <span className="detail-avatar coach-avatar" data-tone={coach.tone} aria-hidden="true">{coach.initials}</span>
            <button type="button" className="enrol-button" id="bookButton" disabled={booked} onClick={handleBook}>
              {booked ? "✓ Request sent" : "Book a session"}
            </button>
            <Link className="coach-chat-link" to={`/trainers?chat=${encodeURIComponent(coach.name)}`}>Chat with {first}</Link>
            <button type="button" className="link-button" id="saveButton" aria-pressed={saved} onClick={handleSave}>
              {saved ? "♥ Saved" : "♡ Save coach"}
            </button>
            <p className="enrol-note">Demo only — no real booking is made.</p>
          </aside>
        </header>

        <div className="detail-grid">
          <div className="detail-main">
            <section className="detail-section" aria-labelledby="aboutHeading">
              <h2 id="aboutHeading">About {first}</h2>
              <p className="coach-text">{profile.bio}</p>
              <h3 className="coach-sub">Approach</h3>
              <p className="coach-text">{profile.approach}</p>
            </section>

            <section className="detail-section" aria-labelledby="sessionsHeading">
              <h2 id="sessionsHeading">Sessions</h2>
              <ul className="session-list">
                {profile.sessions.map((s) => (
                  <li key={s.title}><b>{s.title}</b><span>{s.minutes} min</span></li>
                ))}
              </ul>
            </section>

            <section className="detail-section" aria-labelledby="reviewsHeading">
              <h2 id="reviewsHeading">Reviews</h2>
              <p className="sample-note">Sample reviews for this demo · average {average.toFixed(1)} from {profile.reviews.length}</p>
              <ul className="review-list">
                {profile.reviews.map((r, i) => (
                  <li className="review" key={`${r.name}-${i}`}>
                    <div className="review-head">
                      <b>{r.name}</b>
                      <span className="stars" role="img" aria-label={`${r.rating} out of 5 stars`}>{stars(r.rating)}</span>
                    </div>
                    <p>{r.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="detail-side">
            <section className="detail-section" aria-labelledby="coursesHeading">
              <h2 id="coursesHeading">Courses with {first}</h2>
              {taught.length ? (
                <ul className="coach-courses">
                  {taught.map((c) => (
                    <li key={c.id}>
                      <Link to={`/course?id=${c.id}`}><b>{c.title}</b><small>{c.level} · {window.flexformCourses.formatPrice(c.price)}</small></Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="coach-text">{first} isn't part of a course yet.</p>
              )}
            </section>

            <section className="detail-section" aria-labelledby="credHeading">
              <h2 id="credHeading">Credentials</h2>
              <ul className="learn-list">{profile.credentials.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}