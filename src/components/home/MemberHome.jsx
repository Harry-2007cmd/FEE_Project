import { useEffect, useRef } from "react";

export default function MemberHome() {
  const todaySchedule = [
    { time: "6:30 PM", title: "Strength foundations", coach: "with Maya Chen", type: "Coach session" },
    { time: "8:00 AM", title: "Desk reset", coach: "Self-guided course", type: "Mobility" },
    { time: "7:15 PM", title: "Recovery check-in", coach: "with Arjun Patel", type: "Reset" },
  ];

  const renderTodaySchedule = () => {
    const scheduleList = document.getElementById("todaySchedule");
    if (!scheduleList) return;
    scheduleList.innerHTML = todaySchedule
      .map(
        (item) => `
          <div class="schedule-item">
            <span class="schedule-time">${item.time}</span>
            <div>
              <strong>${item.title}</strong>
              <small>${item.coach}</small>
            </div>
            <span class="history-pill">${item.type}</span>
          </div>
        `,
      )
      .join("");
  };

  // Complete flow toast
  useEffect(() => {
    const handleClick = (event) => {
      const completeButton = event.target.closest("[data-complete]");
      if (completeButton) {
        completeButton.innerHTML = "Flow marked complete ✓";
        const toast = document.querySelector("#toast");
        if (toast) {
          toast.textContent = "Your flow is complete. That counts.";
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 2600);
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Render schedule on mount
  useEffect(() => {
    renderTodaySchedule();
  }, []);

  return (
    <section className="page active member-home hidden" id="page-home-member">
      <div className="page-intro split">
        <div>
          <p className="eyebrow">Tuesday, October 24 · Week 6</p>
          <h1>
            Good morning,<br />
            <em data-greeting-name>Alex.</em>
          </h1>
          <p className="lede">
            A little movement, a little intention. That's enough to change
            the shape of your day.
          </p>
        </div>
        <div className="rhythm-pill">
          <i></i> 6 day rhythm <b>Keep it going</b>
        </div>
      </div>
      <div className="home-grid">
        <article className="dark-card rhythm-card">
          <div className="card-top">
            <span>THIS WEEK'S RHYTHM</span>
            <b>On track</b>
          </div>
          <strong className="big-number">84<span>%</span></strong>
          <p>of your weekly plan completed</p>
          <div className="progress-copy">
            <span>4 of 5 sessions</span>
            <span>+12% from last week</span>
          </div>
          <div className="progress"><i style={{ width: "84%" }}></i></div>
          <div className="dot-orbit">● ○ ●<br />○ ● ○<br />● ○ ●</div>
        </article>
        <article className="cream-card focus-card">
          <div className="card-top">
            <span>TODAY'S FOCUS</span>
            <b className="round-icon">◎</b>
          </div>
          <div>
            <h2>15 minutes<br />to feel <em>lighter.</em></h2>
            <p>
              A short mobility flow, designed for where your body is
              today.
            </p>
          </div>
          <button className="action-button" data-complete>
            Start today's flow <b>→</b>
          </button>
        </article>
      </div>
      <article className="cream-card schedule-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Today</p>
            <h2>Your schedule</h2>
          </div>
        </div>
        <div id="todaySchedule" className="schedule-list"></div>
      </article>
      <div className="stats-row">
        <div>
          <span className="stat-icon coral">ϟ</span>
          <small>ACTIVE DAYS</small>
          <b>06 days</b>
        </div>
        <div>
          <span className="stat-icon sun">↯</span>
          <small>MOVE MINUTES</small>
          <b>128 min</b>
        </div>
        <div>
          <span className="stat-icon mint">♡</span>
          <small>ENERGY TODAY</small>
          <b>Feeling good</b>
        </div>
        <div>
          <span className="stat-icon lilac">↗</span>
          <small>BEST STREAK</small>
          <b>12 days</b>
        </div>
      </div>
      <div className="home-grid lower-grid">
        <article className="cream-card chart-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your numbers</p>
              <h2>The bigger picture</h2>
            </div>
          </div>
          <div className="steps">
            <b>11,240</b>
            <span>steps this week</span>
          </div>
          <svg viewBox="0 0 420 115" preserveAspectRatio="none">
            <path
              d="M4 95 C35 88 44 56 78 70 S117 86 142 46 S183 70 207 53 S249 61 273 25 S309 53 341 39 S376 46 416 12"
            />
          </svg>
          <div className="days">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </article>
        <article className="challenge-card">
          <div className="challenge-overlay">
            <span className="play">▶</span>
            <small>15 MIN · GUIDED SESSION</small>
            <h2>Your daily challenge:<br /><em>show up softly.</em></h2>
            <button className="light-button" data-complete>
              Play session →
            </button>
          </div>
        </article>
      </div>
      <div className="section-heading upcoming-heading">
        <div>
          <p className="eyebrow">Coming up</p>
          <h2>Keep your rhythm</h2>
        </div>
        <a href="/trainers">View all coaches →</a>
      </div>
      <div className="upcoming">
        <div>
          <span className="avatar coral">MC</span>
          <p>
            <b>Strength foundations</b>
            <small>with Maya Chen</small>
          </p>
          <time>Today<br /><b>6:30 PM</b></time>
        </div>
        <div>
          <span className="avatar lilac">DF</span>
          <p>
            <b>Desk reset</b>
            <small>Self-guided course</small>
          </p>
          <time>Tomorrow<br /><b>8 min</b></time>
        </div>
        <div>
          <span className="avatar mint">AP</span>
          <p>
            <b>Recovery check-in</b>
            <small>with Arjun Patel</small>
          </p>
          <time>Fri<br /><b>12:15 PM</b></time>
        </div>
      </div>
    </section>
  );
}