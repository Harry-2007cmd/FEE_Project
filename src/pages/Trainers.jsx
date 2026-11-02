import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/styles.css";
import "../styles/trainers.css";
import TrainerCard from "../components/trainers/TrainerCard.jsx";
import ChatPanel from "../components/trainers/ChatPanel.jsx";
import MatchDialog from "../components/trainers/MatchDialog.jsx";

const TRAINERS_PER_PAGE = 8;
const userKey = (kind) => `flexform:${localStorage.getItem("flexformUserEmail") || "guest"}:${kind}`;
const storeCoachSet = (kind, set) => {
  try {
    localStorage.setItem(userKey(kind), JSON.stringify([...set]));
  } catch {
    /* storage unavailable: state just won't persist */
  }
};

export default function Trainers() {
  const [searchParams] = useSearchParams();
  const [coaches, setCoaches] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All coaches");
  const [availability, setAvailability] = useState("any");
  const [chatCoach, setChatCoach] = useState(null);
  const [matchOpen, setMatchOpen] = useState(false);
  const [userName, setUserName] = useState("Friend");

  const toast = (message) => {
    const element = document.querySelector("#toast");
    if (!element) return;
    element.textContent = message;
    element.classList.add("show");
    setTimeout(() => element.classList.remove("show"), 2600);
  };

  // Load coaches
  useEffect(() => {
    const load = async () => {
      try {
        const list = await window.flexformApi.getCoaches();
        setCoaches(list);
        setLoaded(true);

        // Check for ?chat= param
        const chatWith = searchParams.get("chat");
        if (chatWith && list.some((t) => t.name === chatWith)) {
          setChatCoach(list.find((t) => t.name === chatWith));
        }
      } catch (err) {
        setError(err.message);
        setLoaded(true);
      }
    };
    load();
  }, [searchParams]);

  // Load user name for chat
  useEffect(() => {
    const name = localStorage.getItem("flexformUserName")?.trim() || "Friend";
    setUserName(name);
  }, []);

  // Filter coaches
  const filtered = coaches.filter(
    (trainer) =>
      (activeFilter === "All coaches" || trainer.specialty === activeFilter) &&
      (availability === "any" ||
        availability === "week" ||
        trainer.availability === "today") &&
      (trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.role.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / TRAINERS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * TRAINERS_PER_PAGE;
  const pageItems = filtered.slice(start, start + TRAINERS_PER_PAGE);

  const handleSave = (name) => {
    const savedCoaches = new Set(JSON.parse(localStorage.getItem(userKey("savedCoaches")) || "[]"));
    const nowSaved = !savedCoaches.has(name);
    if (nowSaved) savedCoaches.add(name);
    else savedCoaches.delete(name);
    storeCoachSet("savedCoaches", savedCoaches);
    toast(nowSaved ? "Saved to your coaches" : "Removed from your coaches");
  };

  const handleBook = async (name) => {
    const bookedCoaches = new Set(JSON.parse(localStorage.getItem(userKey("bookedCoaches")) || "[]"));
    await window.flexformApi.bookCoach(name);
    bookedCoaches.add(name);
    storeCoachSet("bookedCoaches", bookedCoaches);
    toast(`Session request sent to ${name}`);
  };

  const handleChat = (name) => {
    const coach = coaches.find((t) => t.name === name);
    if (coach) setChatCoach(coach);
  };

  const applyMatch = (goal, time) => {
    const matches = (avail) =>
      coaches.filter(
        (trainer) =>
          trainer.specialty === goal &&
          (avail === "week" || trainer.availability === "today"),
      ).length;

    let avail = time;
    let message;
    if (time === "today" && matches("today") === 0) {
      avail = "week";
      message = `No ${goal.toLowerCase()} coach is free today. Showing coaches free this week.`;
    } else {
      message = `${matches(avail)} ${goal.toLowerCase()} coaches match you.`;
    }

    setSearchQuery("");
    setAvailability(avail);
    setActiveFilter(goal);
    setPage(1);
    toast(message);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
      <nav id="trainerPagination" className="pagination" aria-label="Coach pages">
        <button
          type="button"
          className="page-button"
          data-page={currentPage - 1}
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
        >
          ←
        </button>
        {numbers.map((number) => (
          <button
            key={number}
            type="button"
            className={`page-button${number === currentPage ? " active" : ""}`}
            data-page={number}
            aria-label={`Page ${number}`}
            aria-current={number === currentPage ? "page" : undefined}
            onClick={() => {
              setPage(number);
              document.getElementById("trainerList")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {number}
          </button>
        ))}
        <button
          type="button"
          className="page-button"
          data-page={currentPage + 1}
          aria-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => setPage(currentPage + 1)}
        >
          →
        </button>
      </nav>
    );
  };

  if (!loaded) {
    return (
      <section className="page active" id="page-trainers">
        <div className="page-intro split">
          <div>
            <p className="eyebrow">The right support changes everything</p>
            <h1>Find your <em>person.</em></h1>
            <p className="lede">Vetted coaches who meet you where you are, then help you go further.</p>
          </div>
          <div className="rhythm-pill">♧ <b>20 coaches</b> in the flexform circle</div>
        </div>
        <div className="filter-box">
          <input id="trainerSearch" type="search" placeholder="⌕  Search by name or focus..." disabled />
          <div className="filters">
            <button className="filter active" data-filter="All coaches" disabled>All coaches</button>
            <button className="filter" data-filter="Strength" disabled>Strength</button>
            <button className="filter" data-filter="Performance" disabled>Performance</button>
            <button className="filter" data-filter="Mindful movement" disabled>Mindful movement</button>
            <button className="filter" data-filter="Nutrition" disabled>Nutrition</button>
          </div>
          <select id="availability" disabled>
            <option value="any">Any time</option>
            <option value="today">Available today</option>
            <option value="week">Available this week</option>
          </select>
          <small id="trainerCount">Loading coaches…</small>
        </div>
        <div id="trainerList" className="trainer-grid">
          <div className="cream-card" role="status"><h2>Loading coaches…</h2></div>
        </div>
        <div className="match-banner">
          <div>
            <p className="eyebrow sun-text">Not sure where to start?</p>
            <h2>Take the guesswork out of your first step.</h2>
            <p>Tell us what you want to feel more of. We'll point you to a coach who gets it.</p>
            <button className="sun-button" data-filter-match disabled>Find my match →</button>
          </div>
          <div className="abstract-photo"><span>MOVE IN YOUR OWN WAY</span></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page active" id="page-trainers">
        <div className="page-intro split">
          <div>
            <p className="eyebrow">The right support changes everything</p>
            <h1>Find your <em>person.</em></h1>
            <p className="lede">Vetted coaches who meet you where you are, then help you go further.</p>
          </div>
          <div className="rhythm-pill">♧ <b>20 coaches</b> in the flexform circle</div>
        </div>
        <div className="filter-box">
          <input id="trainerSearch" type="search" placeholder="⌕  Search by name or focus..." disabled />
          <div className="filters">
            <button className="filter active" data-filter="All coaches" disabled>All coaches</button>
            <button className="filter" data-filter="Strength" disabled>Strength</button>
            <button className="filter" data-filter="Performance" disabled>Performance</button>
            <button className="filter" data-filter="Mindful movement" disabled>Mindful movement</button>
            <button className="filter" data-filter="Nutrition" disabled>Nutrition</button>
          </div>
          <select id="availability" disabled>
            <option value="any">Any time</option>
            <option value="today">Available today</option>
            <option value="week">Available this week</option>
          </select>
          <small id="trainerCount">Coaches could not be loaded</small>
        </div>
        <div id="trainerList" className="trainer-grid">
          <div className="cream-card" role="alert">
            <h2>{error}</h2>
            <button className="sun-button" data-retry onClick={() => window.location.reload()}>Try again</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page active" id="page-trainers">
        <div className="page-intro split">
          <div>
            <p className="eyebrow">The right support changes everything</p>
            <h1>Find your <em>person.</em></h1>
            <p className="lede">Vetted coaches who meet you where you are, then help you go further.</p>
          </div>
          <div className="rhythm-pill">♧ <b>20 coaches</b> in the flexform circle</div>
        </div>
        <div className="filter-box">
          <input
            id="trainerSearch"
            type="search"
            placeholder="⌕  Search by name or focus..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
          <div className="filters">
            {["All coaches", "Strength", "Performance", "Mindful movement", "Nutrition"].map((f) => (
              <button
                key={f}
                className={`filter${f === activeFilter ? " active" : ""}`}
                data-filter={f}
                onClick={() => { setActiveFilter(f); setPage(1); }}
              >
                {f}
              </button>
            ))}
          </div>
          <select
            id="availability"
            value={availability}
            onChange={(e) => { setAvailability(e.target.value); setPage(1); }}
          >
            <option value="any">Any time</option>
            <option value="today">Available today</option>
            <option value="week">Available this week</option>
          </select>
          <small id="trainerCount">
            {filtered.length} {filtered.length === 1 ? "coach matches" : "coaches match"} your search
            {totalPages > 1 ? ` · showing ${start + 1}–${start + pageItems.length}` : ""}
          </small>
        </div>
        <div id="trainerList" className="trainer-grid">
          {pageItems.length > 0
            ? pageItems.map((trainer) => (
                <TrainerCard
                  key={trainer.name}
                  trainer={trainer}
                  onBook={handleBook}
                  onSave={handleSave}
                  onChat={handleChat}
                />
              ))
            : (
              <div className="cream-card">
                <h2>No one by that name yet.</h2>
                <button className="sun-button" data-reset onClick={() => {
                  setSearchQuery("");
                  setAvailability("any");
                  setActiveFilter("All coaches");
                  setPage(1);
                }}>
                  Reset filters
                </button>
              </div>
            )}
        </div>
        {renderPagination()}
        <div className="match-banner">
          <div>
            <p className="eyebrow sun-text">Not sure where to start?</p>
            <h2>Take the guesswork out of your first step.</h2>
            <p>Tell us what you want to feel more of. We'll point you to a coach who gets it.</p>
            <button className="sun-button" data-filter-match onClick={() => { setMatchOpen(true); }}>
              Find my match →
            </button>
          </div>
          <div className="abstract-photo"><span>MOVE IN YOUR OWN WAY</span></div>
        </div>
      </section>
      <ChatPanel isOpen={!!chatCoach} coach={chatCoach} onClose={() => setChatCoach(null)} userName={userName} />
      <MatchDialog isOpen={matchOpen} onClose={() => setMatchOpen(false)} onApply={applyMatch} coachList={coaches} />
    </>
  );
}