import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { escapeHtml } from "../lib/utils.js";
import "../styles/styles.css";
import "../styles/profile.css";

const activity = window.flexformActivity;
const $ = (selector) => document.querySelector(selector);

const lessonMinutes = (courseId, number) => {
  const course = window.courses.find((item) => item.id === courseId);
  return course ? window.lessonsFor(course)[number - 1]?.minutes || 0 : 0;
};
const lessonTitle = (courseId, number) => {
  const course = window.courses.find((item) => item.id === courseId);
  const lesson = course ? window.lessonsFor(course)[number - 1] : null;
  return lesson ? `${course.title}: ${lesson.title}` : "Lesson";
};

const KIND = { workout: ["W", "Workout"], meal: ["M", "Meal"], course: ["C", "Course"], lesson: ["L", "Lesson"] };

const friendlyDay = (day) => {
  const today = activity.dateKey();
  if (day === today) return "Today";
  if (day === activity.addDays(today, -1)) return "Yesterday";
  return activity.parseKey(day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const savedWeeklyGoal = () => {
  try {
    const value = Number(localStorage.getItem(`flexform:${localStorage.getItem("flexformUserEmail") || "guest"}:weeklyGoal`));
    return value >= 1 && value <= 6 ? value : 3;
  } catch {
    return 3;
  }
};

const notify = (message) => {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
};

export default function Profile() {
  const { isLoggedIn, user, updateProfile, refresh } = useAuth();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login?return=/profile");
      return;
    }
    updateProfileDetails();
    renderProgress();
    bindWeightForm();
    bindEditProfile();
  }, [isLoggedIn]);

  const updateProfileDetails = () => {
    const userName = localStorage.getItem("flexformUserName")?.trim() || "Friend";
    const initials = userName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "F";

    const nameNode = $(".profile-name-display");
    if (nameNode) nameNode.textContent = userName;

    const avatarNode = document.getElementById("profileAvatar");
    if (avatarNode) avatarNode.textContent = initials;

    const profileEmail = localStorage.getItem("flexformUserEmail")?.trim();
    const emailNode = document.getElementById("profileEmail");
    if (emailNode) {
      emailNode.textContent = profileEmail || "you@example.com";
    }
  };

  const renderStats = (list) => {
    const today = activity.dateKey();
    const since = activity.addDays(today, -29);
    const week = new Set(activity.weekDays(activity.weekStart(today)));
    const last30 = list.filter((entry) => entry.day >= since && entry.day <= today);
    const thisWeek = list.filter((entry) => week.has(entry.day));
    const totalMinutes = list.reduce((sum, entry) => sum + entry.minutes, 0);

    $("#statHours").textContent = (totalMinutes / 60).toFixed(1);
    $("#statStreak").textContent = String(activity.streak(list));
    $("#statSessions").textContent = String(list.length);
    $("#miniDays").textContent = String(new Set(last30.map((entry) => entry.day)).size);
    $("#miniMinutes").textContent = String(last30.reduce((sum, entry) => sum + entry.minutes, 0));
    $("#miniLessons").textContent = String(last30.filter((entry) => entry.kind === "lesson").length);

    const goal = savedWeeklyGoal();
    const percent = Math.min(100, Math.round((thisWeek.length / goal) * 100));
    $("#goalText").textContent = `${thisWeek.length} / ${goal} moments`;
    $("#goalBar").style.width = `${percent}%`;
    $("#goalProgress").setAttribute("aria-valuenow", String(percent));

    const monthPrefix = today.slice(0, 7);
    const activeDays = new Set(thisWeek.map((entry) => entry.day)).size;
    const doneThisMonth = list.filter((entry) => entry.day.startsWith(monthPrefix)).length;
    $("#trackList").innerHTML = list.length
      ? `<li>${activeDays} active ${activeDays === 1 ? "day" : "days"} this week</li>
         <li>${thisWeek.reduce((sum, entry) => sum + entry.minutes, 0)} minutes of movement logged this week</li>
         <li>${doneThisMonth} ${doneThisMonth === 1 ? "thing" : "things"} completed this month</li>`
      : `<li>Nothing completed yet. <a href="/planner">Plan your week</a> or <a href="/courses">start a lesson</a>.</li>`;
  };

  const renderRecent = (list) => {
    const node = $("#workoutHistory");
    node.innerHTML = list.length
      ? list
          .slice(0, 6)
          .map((entry) => {
            const [badge, label] = KIND[entry.kind] || ["•", "Done"];
            return `<div class="history-item"><span class="history-badge">${badge}</span><div class="history-meta"><strong>${escapeHtml(entry.title)}</strong><small>${friendlyDay(entry.day)}${entry.minutes ? ` · ${entry.minutes} min` : ""}</small></div><span class="history-pill">${label}</span></div>`;
          })
          .join("")
      : `<div class="history-item history-empty"><div class="history-meta"><strong>No activity yet</strong><small>Tick something off in your planner or finish a lesson and it will show up here.</small></div></div>`;
  };

  const renderWeekChart = (list) => {
    const days = activity.weekDays(activity.weekStart());
    const counts = days.map((day) => list.filter((entry) => entry.day === day).length);
    const max = Math.max(1, ...counts);
    const today = activity.dateKey();
    $("#weekChart").setAttribute("aria-label", `Completed per day this week: ${days.map((day, i) => `${activity.parseKey(day).toLocaleDateString("en-US", { weekday: "long" })} ${counts[i]}`).join(", ")}`);
    $("#weekChart").innerHTML = days
      .map(
        (day, i) => `<div class="bar-col${day === today ? " today" : ""}" aria-hidden="true"><b>${counts[i]}</b><span class="bar"><i style="height:${Math.round((counts[i] / max) * 100)}%"></i></span><small>${activity.parseKey(day).toLocaleDateString("en-US", { weekday: "short" })}</small></div>`,
      )
      .join("");
    const total = counts.reduce((a, b) => a + b, 0);
    $("#weekChartNote").textContent = total ? `${total} completed this week.` : "Nothing completed yet this week.";
  };

  const renderWeight = () => {
    const entries = activity.readWeights();
    const chart = $("#weightChart");
    if (entries.length < 2) {
      chart.innerHTML = `<p class="insight-note">${entries.length ? "Add one more entry to see your trend." : "Log your weight to see your trend over time."}</p>`;
    } else {
      const shown = entries.slice(-10);
      const kgs = shown.map((entry) => entry.kg);
      const low = Math.min(...kgs);
      const high = Math.max(...kgs);
      const pad = Math.max(0.5, (high - low) * 0.2);
      const [min, max] = [low - pad, high + pad];
      const x = (i) => 20 + (i * 260) / (shown.length - 1);
      const y = (kg) => 10 + (1 - (kg - min) / (max - min)) * 90;
      const points = shown.map((entry, i) => `${x(i).toFixed(1)},${y(entry.kg).toFixed(1)}`).join(" ");
      const short = (day) => activity.parseKey(day).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      chart.innerHTML = `<svg viewBox="0 0 300 130" role="img" aria-label="Weight from ${short(shown[0].date)} (${shown[0].kg} kg) to ${short(shown[shown.length - 1].date)} (${shown[shown.length - 1].kg} kg)">
          <polyline points="${points}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
          ${shown.map((entry, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(entry.kg).toFixed(1)}" r="4" fill="currentColor" />`).join("")}
          <text x="20" y="124" font-size="11" fill="var(--stone)">${short(shown[0].date)}</text>
          <text x="280" y="124" font-size="11" fill="var(--stone)" text-anchor="end">${short(shown[shown.length - 1].date)}</text>
        </svg>`;
    }
    const newest = entries.slice().reverse();
    $("#weightList").innerHTML = newest
      .slice(0, 5)
      .map((entry, i) => {
        const before = newest[i + 1];
        const diff = before ? Math.round((entry.kg - before.kg) * 10) / 10 : null;
        const change = diff === null ? "" : diff === 0 ? "no change" : `${diff > 0 ? "+" : "−"}${Math.abs(diff)} kg`;
        return `<li><span>${activity.parseKey(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span><b>${entry.kg} kg</b><small>${change}</small><button type="button" class="weight-remove" data-date="${entry.date}" aria-label="Remove entry for ${entry.date}">Remove</button></li>`;
      })
      .join("");
  };

  const renderProgress = () => {
    const list = activity.completions(lessonMinutes, lessonTitle);
    renderStats(list);
    renderRecent(list);
    renderWeekChart(list);
    renderWeight();
  };

  const bindWeightForm = () => {
    const form = $("#weightForm");
    const dateInput = $("#weightDate");
    const today = activity.dateKey();
    dateInput.value = today;
    dateInput.max = today;
    const error = $("#weightError");
    const fail = (message) => {
      error.textContent = message;
      error.classList.remove("hidden");
    };
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const date = dateInput.value;
      const raw = $("#weightKg").value.trim();
      const kg = Number(raw);
      if (!date) return fail("Choose a date.");
      if (date > today) return fail("The date can't be in the future.");
      if (raw === "" || !Number.isFinite(kg)) return fail("Enter your weight in kg.");
      if (kg < 25 || kg > 300) return fail("Enter a weight between 25 and 300 kg.");
      error.classList.add("hidden");
      activity.saveWeight(date, Math.round(kg * 10) / 10);
      $("#weightKg").value = "";
      renderWeight();
      notify("Weight saved");
    });
    $("#weightList")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-date]");
      if (!button) return;
      activity.removeWeight(button.dataset.date);
      renderWeight();
      $("#weightKg").focus();
      notify("Entry removed");
    });
  };

  const bindEditProfile = () => {
    const button = document.querySelector("#editProfile");
    const form = document.querySelector("#editProfileForm");
    if (!button || !form) return;

    const setOpen = (open) => {
      form.classList.toggle("hidden", !open);
      button.setAttribute("aria-expanded", String(open));
      if (open) {
        form.elements.name.value = localStorage.getItem("flexformUserName")?.trim() || "";
        form.elements.email.value = localStorage.getItem("flexformUserEmail") || "";
        document.querySelector("#editError")?.classList.add("hidden");
        form.elements.name.focus();
      }
    };

    button?.addEventListener("click", () => setOpen(!form.classList.contains("hidden")));
    document.querySelector("#cancelEdit")?.addEventListener("click", () => {
      setOpen(false);
      button.focus();
    });

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const errorNode = document.querySelector("#editError");
      const name = form.elements.name.value.trim();
      const email = window.flexformUsers.normaliseEmail(form.elements.email.value);

      const oldEmail = localStorage.getItem("flexformUserEmail") || "";
      const result = window.flexformAuth.updateAccount(oldEmail, { name, email });
      if (!result.ok) {
        errorNode.textContent = Object.values(result.errors)[0];
        errorNode.classList.remove("hidden");
        return;
      }
      errorNode.classList.add("hidden");

      window.flexformUsers.renameEmail(oldEmail, email);
      window.flexformUsers.setName(email, result.account.name);

      updateProfileDetails();
      refresh();
      setOpen(false);
      button.focus();
      notify("Profile updated");
    });
  };

  return (
    <section className="page active" id="page-profile">
      <div className="page-intro split">
        <div>
          <p className="eyebrow">A record of showing up</p>
          <h1>My <em>progress.</em></h1>
          <p className="lede">Notice what's changing, inside and out.</p>
        </div>
        <div className="profile-actions">
          <a className="outline-button" href="/planner">▦ My planner</a>
          <button
            className="outline-button"
            id="editProfile"
            type="button"
            aria-expanded={editOpen}
            aria-controls="editProfileForm"
          >
            ⚙ Edit profile
          </button>
        </div>
      </div>
      <form className="cream-card edit-profile hidden" id="editProfileForm">
        <label>Name<input id="editName" name="name" required maxLength="60" autoComplete="name" /></label>
        <label>Email address<input id="editEmail" name="email" type="email" required autoComplete="email" /></label>
        <p className="form-error hidden" id="editError" role="alert"></p>
        <div className="edit-profile-actions">
          <button className="action-button" type="submit">Save changes</button>
          <button className="outline-button" id="cancelEdit" type="button">Cancel</button>
        </div>
      </form>
      <div className="profile-grid">
        <article className="dark-card profile-card">
          <div className="profile-head">
            <span className="avatar sun" id="profileAvatar">AL</span>
            <div>
              <h2 className="profile-name-display">Alex Lee</h2>
              <p>Member since May 2024</p>
            </div>
          </div>
          <div className="intention">
            <small>MY INTENTION</small>
            <b>Feel stronger and sleep better.</b>
          </div>
          <div className="profile-stats">
            <div><b id="statHours">0</b><small>move hours</small></div>
            <div><b id="statStreak">0</b><small>day streak</small></div>
            <div><b id="statSessions">0</b><small>completed</small></div>
          </div>
        </article>
        <article className="cream-card progress-card">
          <p className="eyebrow">Over the last 30 days</p>
          <h2>A steadier you</h2>
          <div className="mini-stats">
            <div>ϟ<strong id="miniDays">0</strong><small>ACTIVE DAYS</small></div>
            <div>◷<strong id="miniMinutes">0</strong><small>MOVE MINUTES</small></div>
            <div>▤<strong id="miniLessons">0</strong><small>LESSONS DONE</small></div>
          </div>
          <div className="progress-copy">
            <span>Weekly goal</span><b id="goalText">0 / 3 moments</b>
          </div>
          <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Weekly goal progress" id="goalProgress"><i id="goalBar" style={{ width: "0%" }}></i></div>
        </article>
      </div>
      <div className="profile-lower-grid">
        <article className="cream-card track-card">
          <p className="eyebrow">Your track</p>
          <h2>Consistency is the win.</h2>
          <ul className="feature-list" id="trackList"></ul>
        </article>
        <article className="dark-card user-card">
          <p className="eyebrow sun-text">Your profile</p>
          <h2>Account details</h2>
          <div className="user-meta">
            <div><small>Email</small><b id="profileEmail">alex@flexform.com</b></div>
            <div><small>Membership</small><b>Active</b></div>
          </div>
          <button className="outline-button logout-button" type="button" data-logout>Log out</button>
        </article>
      </div>
      <div className="insight-grid">
        <section className="cream-card insight-card" aria-labelledby="weekChartHeading">
          <p className="eyebrow">This week</p>
          <h2 id="weekChartHeading">Activity by day</h2>
          <div id="weekChart" className="week-chart" role="img" aria-label="Completed items per day this week"></div>
          <p className="insight-note" id="weekChartNote"></p>
        </section>
        <section className="cream-card insight-card" aria-labelledby="weightHeading">
          <p className="eyebrow">Body</p>
          <h2 id="weightHeading">Weight log</h2>
          <form className="weight-form" id="weightForm" noValidate>
            <label>Date<input id="weightDate" type="date" required /></label>
            <label>Weight (kg)<input id="weightKg" type="number" inputMode="decimal" step="0.1" min="25" max="300" placeholder="e.g. 68.4" required /></label>
            <button className="action-button" type="submit">Save</button>
          </form>
          <p className="form-error hidden" id="weightError" role="alert"></p>
          <div id="weightChart" className="weight-chart"></div>
          <ul className="weight-list" id="weightList"></ul>
        </section>
      </div>
      <div className="section-heading upcoming-heading">
        <div>
          <p className="eyebrow">What you've completed</p>
          <h2>Recent activity</h2>
        </div>
      </div>
      <div id="workoutHistory" className="history-list"></div>
      <div className="section-heading upcoming-heading">
        <div>
          <p className="eyebrow">On your calendar</p>
          <h2>Upcoming bookings</h2>
        </div>
        <a href="/trainers">Book another +</a>
      </div>
      <div className="upcoming">
        <div>
          <span className="avatar coral">MC</span>
          <p>
            <b>Strength foundations</b>
            <small>with Maya Chen · Today</small>
          </p>
          <time>6:30<br /><b>PM</b></time>
        </div>
        <div>
          <span className="avatar lilac">AP</span>
          <p>
            <b>Recovery check-in</b>
            <small>with Arjun Patel · Friday</small>
          </p>
          <time>12:15<br /><b>PM</b></time>
        </div>
      </div>
    </section>
  );
}